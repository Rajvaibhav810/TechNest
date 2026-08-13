const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

// All order routes require authentication
router.use(authenticateUser);

// POST /api/orders — place a new order
router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').notEmpty().withMessage('Each item must have a productId'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item must have a quantity of at least 1'),
  ],
  validateRequest,
  createOrder
);

// GET /api/orders — get orders (user: own, admin: all)
router.get('/', getOrders);

// GET /api/orders/:id — get specific order
router.get('/:id', getOrderById);

// PUT /api/orders/:id/status — update status (admin only)
router.put('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
