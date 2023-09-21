const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the order to pay for
  const order = await Order.findById(req.params.orderId);

  //   if (order.user._id.toString() !== req.user._id.toString())
  //     return next(new AppError('You can only pay for your own orders'));
  if (!order) return next(new AppError('Order not found', 404));

  const lineItems = [];

  order.items.forEach((item) => {
    lineItems.push({
      price_data: {
        currency: 'usd',
        unit_amount: item.product.price * 100,
        product_data: {
          name: item.product.name,
        },
      },
      quantity: item.quantity,
    });
  });

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/payments/?order=${
      req.params.orderId
    }&user=${order.user}&price=${order.totalPrice}`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/orders/my-orders`,
    client_reference_id: req.params.orderId,
  });

  // Send the session as respnse
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createPaymentCheckout = catchAsync(async (req, res, next) => {
  const { order, user, price } = req.query;
  console.log('HELLO FROM MIDDLEWARE');

  if (!order && !user && !price) return next();

  await Payment.create({ order, user, price, paymentMethod: 'card' });

  res.redirect(req.originalUrl.split('payments')[0].concat('orders/my-orders'));
  next();
});
