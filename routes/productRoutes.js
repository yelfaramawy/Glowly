const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router.get(
  '/top-sales',
  productController.getTopSales,
  productController.getAllProducts
);
router.get(
  '/most-popular',
  productController.getMostPopular,
  productController.getAllProducts
);
router.get('/category/:categoryName', productController.getProductsByCategory);
router.post(
  '/sale/:productId',
  authController.protect,
  authController.restrictTo('admin'),
  productController.applySale
);

router
  .route('/:productId')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
