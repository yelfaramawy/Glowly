const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = mongoose.Schema(
  {
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
      required: [true, 'Please provide the product category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide the product price'],
    },
    salePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    originalPrice: Number,
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
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate reviews on products
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
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

productSchema.pre('save', function (next) {
  if (this.isNew) {
    this.originalPrice = this.price;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
