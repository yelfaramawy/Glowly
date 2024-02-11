const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const cleanCache = require('../utils/cache');

const router = express.Router();

router.post('/', authController.protect, cleanCache, cartController.addToCart);
router.delete('/', authController.protect, cartController.removeFromCart);
router.get('/', authController.protect, cartController.getMyCart);
// router.patch('/', authController.protect, cartController.updateCart);

module.exports = router;
