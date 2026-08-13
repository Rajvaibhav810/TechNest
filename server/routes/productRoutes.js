const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category')
    .isIn(['Gaming', 'Laptops', 'Keyboards', 'Mouse', 'Headphones', 'Accessories'])
    .withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authenticateUser, requireAdmin, productValidation, validateRequest, createProduct);
router.put('/:id', authenticateUser, requireAdmin, productValidation, validateRequest, updateProduct);
router.delete('/:id', authenticateUser, requireAdmin, deleteProduct);

module.exports = router;
