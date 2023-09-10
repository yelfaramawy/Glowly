const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// function calculateTotalPrice(cartItems) {
//   let totalPrice = 0;

//   cartItems.forEach(
//     (item) => (totalPrice += item.product.price * item.quantity)
//   );
//   return totalPrice;
// }

exports.addToCart = catchAsync(async (req, res, next) => {
  // Get the cart that was already created at signUp and createUser
  const cart = await Cart.findOne({ user: req.user.id });

  const product = await Product.findById(req.body.productId);

  if (req.body.quantity > product.inStock)
    return next(
      new AppError(
        `The quantity you want is not available. Only ${product.inStock} pieces are in stock`
      )
    );

  // Check if the item is already in cart
  console.log(cart);
  const itemIndex = cart.items.findIndex(
    (item) => item.product.id === req.body.productId
  );

  // If The item is already in the cart, update the quantity
  if (itemIndex !== -1) {
    cart.items[itemIndex].quantity += req.body.quantity;
  } else {
    // If the item is not in the cart, add the item and the quantity
    cart.items.push({
      product: req.body.productId,
      quantity: req.body.quantity || 1,
    });
  }
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
    return next(new AppError('Product not found in the cart', 404));
  }

  const removedItem = cart.items[itemIndex];

  // If the user deletes all the quantites, delete the item
  if (removedItem.quantity === req.body.quantity) {
    cart.items.splice(itemIndex, 1);
  } else {
    // If only deletes some, then reduce the deleted quantity
    removedItem.quantity -= req.body.quantity;
  }

  cart.totalPrice -= removedItem.product.price * req.body.quantity;

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

  if (!cart) return next(new AppError('There is no cart for this user', 404));
  // console.log(cart.items[0].product.price);

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

//TODO: Allow users to update cart

// exports.updateCart = catchAsync(async (req, res, next) => {
//   const cart = await Cart.findOne({ user: req.user.id });

//   const cartItem = cart.items.find(
//     (item) => item.product.id === req.body.productId
//   );

//   if (!cartItem)
//     return next(new AppError('Product not wfound in the cart', 404));

//   cartItem.quantity = req.body.quantity;
//   cart.totalPrice = calculateTotalPrice(cart.items);
// });
