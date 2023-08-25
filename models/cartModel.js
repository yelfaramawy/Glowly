const mongoose = require('mongoose');
const Product = require('./productModel');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A cart must belong to a user'],
  },
  items: [
    {
      Product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'A cart must have a product'],
      },
      quantity: {
        type: Number,
        required: [true, 'A product must have a quantity'],
        min: 1,
      },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
