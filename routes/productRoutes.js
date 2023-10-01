const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// Apply nested routes for reviews on products
router.use('/:productId/reviews', reviewRouter);

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

router.get('/wishlist', authController.protect, productController.getWishlist);
router
  .route('/wishlist/:productId')
  .post(authController.protect, productController.addToWishlist)
  .delete(authController.protect, productController.removeFromWishlist);

router.get(
  '/out-of-stock',
  authController.protect,
  authController.restrictTo('admin'),
  productController.getOutOfStock,
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
