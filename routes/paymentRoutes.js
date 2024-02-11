const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect);

router.use('/', paymentController.createPaymentCheckout);

router.get('/checkout-session/:orderId', paymentController.getCheckoutSession);

module.exports = router;
