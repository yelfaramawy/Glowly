const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Protect all
router.use(authController.protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.patch('/cancel/:orderId', orderController.cancelOrder);

// ADMIN RESTRICTIONS

router.use(authController.restrictTo('admin'));

router.get('/', orderController.getAllOrders);

router.patch('/update-status/:orderId', orderController.updateOrderStatus);
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;
