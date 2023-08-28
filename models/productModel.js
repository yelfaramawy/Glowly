const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
  },
  slug: String,
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

// Create product slug
// productSchema.pre('save', function (next) {
//   // const cleanName = this.name.replace(/[^a-zA-Z0-9]/g, '');
//   const cleanName = this.name.replace(/[^a-zA-Z0-9\s]/g, '');
//   this.slug = slugify(this.name, {
//     lower: true,
//     // remove: /[^a-zA-Z0-9-]/g,
//     // replacement: '',
//   });
//   next();
// });

productSchema.pre('save', function (next) {
  const modifiedName = this.name.replace(/[^a-zA-Z0-9\s-]/g, ''); // Include "@" and "."
  console.log(modifiedName);
  this.slug = slugify(modifiedName, {
    lower: true,
    replacement: '-',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
