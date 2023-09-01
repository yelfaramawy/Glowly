const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.addToCart = catchAsync(async (req, res, next) => {
  //   const { productId, quantity } = req.body;
  //   const user = req.user.id;

  // Get the cart that was already created at signUp and createUser
  const cart = await Cart.findOne({ user: req.user.id });

  const product = await Product.findById(req.body.productId);

  console.log(product);

  cart.items.push({
    product: req.body.productId,
    quantity: req.body.quantity || 1,
  });

  cart.totalPrice += product.price * req.body.quantity;

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  // Get the index of the removed item
  const itemIndex = cart.items.findIndex(
    (item) => item.product.id === req.body.productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Product not found in the cart'));
  }

  // Get the removed item and edit cart total price
  const removedItem = cart.items[itemIndex];
  cart.totalPrice -= removedItem.product.price * removedItem.quantity;

  cart.items.splice(itemIndex, 1);

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) return next(new AppError('There is no cart for this user'));

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});
