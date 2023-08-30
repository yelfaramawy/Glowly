const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    unique: true,
  },
  slug: String,
  category: {
    type: String,
    enum: [
      'sunglasses',
      'watches',
      'hats',
      'jewelery',
      'wallets',
      'grooming',
      'perfumes',
    ],
    required: [true, 'Please provide a product price'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
  },
  salePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  previousPrice: Number,
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
  soldOut: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Number,
    required: [true, 'Please enter the quantity available in stock'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Create product slug
productSchema.pre('save', function (next) {
  const modifiedName = this.name.replace(/[^a-zA-Z0-9\s-]/g, '');
  console.log(modifiedName);
  this.slug = slugify(modifiedName, {
    lower: true,
    replacement: '-',
  });
  next();
});

// Calculate sale price, If there's a sale
productSchema.pre('save', function (next) {
  console.log('Percentage changed!!');
  if (this.isModified('salePercentage')) {
    this.previousPrice = this.price;
    this.price = this.price - (this.price * this.salePercentage) / 100;
  }
  next();
});

// productSchema.methods.updatePrice = function(){
//   if(this.productSchema)
// }

productSchema.pre('update', function (next) {
  // const pricePercentage = this.getUpdate().$set.pricePercentage;
  // console.log('percentage changed');
  // console.log(pricePercentage);
  // if (!pricePercentage) return next();
  // this.price = this.price - (this.price * this.pricePercentage) / 100;
  if (this.isModified('salePercentage')) {
    this.previousPrice = this.price;
    this.price = this.price - (this.price * this.salePercentage) / 100;
    // this.price = undefined;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
