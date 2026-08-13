const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @route   GET /api/products
 * @desc    Get all products with optional search, filter, sort
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, limit } = req.query;

  // Build filter object
  const filter = {};

  if (search && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  // Build sort object
  let sortOption = { createdAt: -1 }; // default: newest first
  if (sort === 'name_asc') sortOption = { name: 1 };
  else if (sort === 'name_desc') sortOption = { name: -1 };
  else if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };

  let query = Product.find(filter).sort(sortOption);

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const products = await query;

  return sendSuccess(res, 200, 'Products fetched successfully.', { products });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by MongoDB _id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendError(res, 404, 'Product not found.');
  }
  return sendSuccess(res, 200, 'Product fetched successfully.', { product });
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, image, price, category, description, stock } = req.body;
  const product = await Product.create({ name, image, price, category, description, stock });
  return sendSuccess(res, 201, 'Product created successfully.', { product });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, price, category, description, stock } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, image, price, category, description, stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    return sendError(res, 404, 'Product not found.');
  }

  return sendSuccess(res, 200, 'Product updated successfully.', { product });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin only)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return sendError(res, 404, 'Product not found.');
  }
  return sendSuccess(res, 200, 'Product deleted successfully.');
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
