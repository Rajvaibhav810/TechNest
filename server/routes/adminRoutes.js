const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticateUser, requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Dashboard statistics
 * @access  Admin
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [totalProducts, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find(),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Recent 5 orders for dashboard preview
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(res, 200, 'Stats fetched successfully.', {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  })
);

module.exports = router;
