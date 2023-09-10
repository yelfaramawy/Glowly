const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFEeatures = require('../utils/apiFeatures');

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
  const features = new APIFEeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const products = await features.query;

  if (products.length === 0)
    return next(new AppError('No products found', 404));

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate(
    'reviews'
  );

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
  // Specify product updates from the request body
  const { name, category, description, image, soldOut, inStock } = req.body;
  const productUpdates = {
    name,
    category,
    description,
    image,
    soldOut,
    inStock,
  };
  // product updates if there is a change in price
  if (req.body.price) {
    const newPrice = req.body.price;
    productUpdates.price = newPrice;
    productUpdates.originalPrice = newPrice;
    productUpdates.salePercentage = 0;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    productUpdates,
    {
      new: true,
      runValidators: true,
    }
  );

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
  const product = await Product.findById(req.params.productId);
  const { salePercentage } = req.body;

  if (!product)
    return next(new AppError('There is no product with this ID', 404));

  product.salePercentage = salePercentage;
  product.price =
    product.originalPrice - (product.originalPrice * salePercentage) / 100;

  await product.save();
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
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
// TO DO:
//*TODO: make this sort by rating average
exports.getTopSales = catchAsync(async (req, res, next) => {
  req.query.limit = 10;
  req.query.sort = '-salePercentage,price';
  req.query.fields =
    'name,price,salePercentage,originalPrice,description,inStock';

  next();
});

exports.getMostPopular = catchAsync(async (req, res, next) => {
  req.query.limit = 10;
  req.query.sort = '-soldOut';
  req.query.fields =
    'name,price,salePercentage,originalPrice,description,inStock';

  next();
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return next(new AppError('There is no product with that ID', 404));

  res.status(200).json({
    status: 'success',
  });
});

exports.getOutOfStock = catchAsync(async (req, res, next) => {
  req.query.available = false;
  next();
});
