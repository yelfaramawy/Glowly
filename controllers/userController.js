const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const APIFEeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

// Filter object fields
const filterObj = (obj, ...filterFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (filterFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for updating password'));

  const filteredBody = filterObj(req.body, 'name', 'email', 'phone', 'address');
  const updatedUser = await Userser.findByIdAndUpdate(req.body, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
  });
});

// CRUD Operations

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  // Create Cart for the new user
  await Cart.create(user._id);

  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFEeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();
  const users = await features.query;
  if (users.length === 0) return next(new AppError('No users found', 404));

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('There is no user with this ID', 404));

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// This is not used to update password
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new AppError('There is no user with this ID', 400));

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('There is no user with this ID', 400));

  await Cart.findOneAndDelete({ user: req.params.id });

  res.status(200).json({
    status: 'success',
  });
});
