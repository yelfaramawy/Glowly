const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Payment must belong to a user'],
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: [true, 'Payment must belong to an order'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price of the checkout'],
  },
  paymentMethod: {
    type: String,
    enum: ['cash on delivery', 'card'],
    required: [true, 'Please provide how do you like to pay'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

//TODO: Populate user and product at payment

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
