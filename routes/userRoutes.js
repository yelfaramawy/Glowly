const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.post('/login', authController.login)
// router.post('/signup', authController.signup)
// router.get('/logout', authController.logout)
// router.post('/forgotPassword', authController.forgotPassword)
// router.patch('/resetPasswordToken/:token', authController.resetPassword)

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Admin restrictions
router.use(authController.protect, authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
