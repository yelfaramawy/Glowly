const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  // // Check if the user has already purchased the product (NEW FEATURE)
  // const validOrder = await Order.findOne({
  //   user: req.user.id,
  //   items: { $elemMatch: { product: req.body.product } },
  //   status: { $in: ['shipped', 'refunded'] },
  // });

  // if (!validOrder)
  //   return next(
  //     new AppError('You can only review orders you already purchased', 400)
  //   );

  // Create the review
  const review = await Review.create(req.body);
  // const review = await Review.create({
  //   user: req.user.id,
  //   product: req.body.product,
  //   rating: req.body.rating,
  //   review: req.body.review,
  // });

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  const reviews = await Review.find(filter);

  if (reviews.length === 0) return next(new AppError('No reviews found', 404));

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review)
    return next(new AppError('There is no review with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = Review.findOneAndUpdate(
    { _id: req.params.reviewId, user: req.user.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!review) return next(new AppError('This review does not exists', 404));

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.reviewId,
    user: req.user.id,
  });

  if (!review) return next(new AppError('This review does not exist', 404));

  res.status(200).json({
    status: 'success',
  });
});
