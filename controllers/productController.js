const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError('There is no Product with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product)
    return next(new AppError('There is no product with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.applySale = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const salePercentage = req.body.salePercentage;

  if (!product)
    return next(new AppError('There is no product with this ID', 404));

  product.salePercentage = salePercentage;
  product.previousPrice = product.price;
  product.price = product.price - (product.price * salePercentage) / 100;

  await product.save();
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return next(new AppError('There is no product with that ID', 404));

  res.status(200).json({
    status: 'success',
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    category: req.params.categoryName,
  });

  if (!products) return next(new AppError('No products found', 404));

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});
