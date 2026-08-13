const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @route   POST /api/orders
 * @desc    Place a new order with atomic stock validation
 * @access  Private (User)
 *
 * CONCURRENT STOCK SAFETY:
 * Instead of:  1) READ stock  2) CHECK if enough  3) UPDATE (unsafe race condition)
 *
 * We use a MongoDB atomic findOneAndUpdate with a $gte condition:
 *   Update the product ONLY if stock >= requestedQty
 *   and atomically decrement stock by qty in one operation.
 *
 * This runs inside a MongoDB session (transaction), so if ANY product
 * fails the stock check, ALL stock decrements are rolled back.
 * This guarantees no overselling even under concurrent requests.
 */
const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return sendError(res, 400, 'Cart is empty. Please add items before placing an order.');
  }

  // Start a MongoDB session for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderedProducts = [];
    let totalAmount = 0;

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        await session.abortTransaction();
        session.endSession();
        return sendError(res, 400, 'Invalid order item. Each item must have a productId and quantity >= 1.');
      }

      // ATOMIC OPERATION: Only update if stock >= quantity
      // This is the core concurrency fix — single round-trip, no race condition
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } }, // condition: must have enough stock
        { $inc: { stock: -quantity } },                  // atomically decrement
        { new: true, session }                           // use transaction session
      );

      if (!updatedProduct) {
        // Either product not found or insufficient stock
        const product = await Product.findById(productId).session(session);
        await session.abortTransaction();
        session.endSession();

        if (!product) {
          return sendError(res, 404, `Product not found.`);
        }
        return sendError(
          res,
          400,
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
        );
      }

      // Build order snapshot (use DB price, NOT client-sent price)
      const subtotal = updatedProduct.price * quantity;
      totalAmount += subtotal;

      orderedProducts.push({
        productId: updatedProduct._id,
        name: updatedProduct.name,
        image: updatedProduct.image,
        price: updatedProduct.price,   // server-side price — never trust frontend
        quantity,
        subtotal,
      });
    }

    // Create the order document
    const order = await Order.create(
      [
        {
          userId: req.user._id,
          products: orderedProducts,
          totalAmount,
          orderStatus: 'Order Placed',
        },
      ],
      { session }
    );

    // Commit transaction — stock decrements + order creation are now permanent
    await session.commitTransaction();
    session.endSession();

    // Populate user info for response
    const populatedOrder = await Order.findById(order[0]._id).populate('userId', 'name email');

    return sendSuccess(res, 201, 'Order placed successfully.', { order: populatedOrder });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Let global error handler deal with it
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get orders. Users see only their own; admin sees all.
 * @access  Private
 */
const getOrders = asyncHandler(async (req, res) => {
  let filter = {};

  // Normal users only see their own orders
  if (req.user.role !== 'admin') {
    filter.userId = req.user._id;
  }

  const orders = await Order.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Orders fetched successfully.', { orders });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get a specific order (owner or admin only)
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'name email');

  if (!order) {
    return sendError(res, 404, 'Order not found.');
  }

  // Non-admins can only view their own orders
  if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
    return sendError(res, 403, 'You are not authorized to view this order.');
  }

  return sendSuccess(res, 200, 'Order fetched successfully.', { order });
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (admin only)
 * @access  Private (Admin)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    return sendError(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true, runValidators: true }
  ).populate('userId', 'name email');

  if (!order) {
    return sendError(res, 404, 'Order not found.');
  }

  return sendSuccess(res, 200, 'Order status updated successfully.', { order });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
