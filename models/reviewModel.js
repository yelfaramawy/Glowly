const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please rate the product from 1 to 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide the product you want to rate'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  // this points to the model not the document
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  // save the calculated rating to the product document
  await Product.findByIdAndUpdate(productId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRatings,
  });
};

reviewSchema.post('save', function () {
  // this refers to the document so we use this.constructor to get access to the model
  this.constructor.calcAverageRatings(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
