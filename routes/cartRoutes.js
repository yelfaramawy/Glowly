const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/', authController.protect, cartController.addToCart);
router.delete('/', authController.protect, cartController.removeFromCart);
router.get('/', authController.protect, cartController.getMyCart);

module.exports = router;
