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
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        // required: [true, 'A cart must have a product'],
      },
      quantity: {
        type: Number,
        min: 1,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: 'name price',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
