const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { phone, shippingAddress, paymentMethod, status } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart || cart.items.length === 0)
    return next(
      new AppError(
        'Your cart is currently empty. Add items to your cart before creating an order',
        400
      )
    );

  const orderItems = cart.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  console.log(orderItems);

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalPrice: cart.totalPrice,
    phone,
    shippingAddress,
    paymentMethod,
    // status
  });

  // Clear the cart again
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  if (orders.length === 0)
    return next(new AppError("You don't have any orders yet", 400));

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) return next(new AppError('There is no order with that ID', 404));

  // Ensure the order belongs to the authenticated user

  if (!order.user._id.equals(req.user.id))
    return next(new AppError('You have no access to cancel this order ', 401));

  // If the order status is neither pending nor processing, It cannot be cancelled
  if (order.status !== 'pending' && order.status !== 'processing')
    return next(
      new AppError(
        `This order is ${order.status}. You can no longer cancel this order`,
        400
      )
    );

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Your order was cancelled successfully',
  });
});

// ADMIN RESTRICTIONS

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  if (orders.length === 0) return next(new AppError('No orders found', 404));

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      status: req.body.status,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!order) return next(new AppError('There is no order with that ID', 404));

  // Update in stock items
  if (req.body.status === 'processing') {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inStock -= item.quantity;
        product.soldOut += item.quantity;
        product.available = product.inStock > 0;
        await product.save();
      }
    }
  } else if (req.body.status === 'refunded') {
    for (const item of order.items) {
      const product = await Product.findById(items.product);
      if (product) {
        product.inStock += item.quantity;
        product.inStock -= item.quantity;
        product.available = product.inStock > 0;
        await product.save();
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);

  if (!order) return next(new AppError('There is no error with that ID'), 404);

  res.status(200).json({
    status: 'success',
  });
});
