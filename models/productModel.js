const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
  },
  category: {
    type: String,
    enum: [
      'Sunglasses',
      'Watches',
      'Hats & Caps',
      'Jewelery',
      'Wallets',
      'Grooming',
    ],
    required: [true, 'Please provide a product price'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  image: {
    type: [String],
    required: [true, 'Please provide a product image'],
    validate: {
      validator: function (val) {
        return val.length <= 10;
      },
      message: 'Only 10 images is allowed for a product',
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  soldOut: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Number,
    required: [true, 'Please enter the quantity available in stock'],
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
