const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    requried: [true, 'Order must belong to a user'],
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Product must be included in the order'],
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
    min: 0,
  },
  shippingAddress: {
    type: String,
    required: [true, 'order must have an address for shipping'],
  },
  phone: {
    type: Number,
    validate: {
      validator: function (value) {
        return /^(\+20|0)?1[0-9]{9}$/.test(value);
      },
      message: 'Please enter a valid phone number',
    },
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash on delivery', 'card'],
    required: [true, 'Please provide how do you like to pay'],
    // default: 'cash on delivery',
  },
});

orderSchema.index({ user: 1 });

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: 'name price',
  });
  next();
});

//? Only need to populate user if we want to use his data in userSchema

// orderSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//     select: 'name address phone',
//   });
//   next();
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
