const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your first name'],
    minlength: 4,
    maxlength: 25,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please Provide your email'],
    validate: [validator.isEmail, 'Invalid email'],
  },
  address: String,
  phone: {
    type: Number,
    validate: {
      validator: function (value) {
        return /^(\+20|0)?1[0-9]{9}$/.test(value);
      },
      message: 'Please enter a valid phone number',
    },
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // TO BE REFERENCED LATER
  orders: Array,
  cart: Array,
  password: {
    type: String,
    minlength: 8,
    maxlength: 10,
    required: [true, 'Please provide a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// If the password has changed, Hash and save it
userSchema.pre('save', async function (next) {
  // if (!this.password.isModified) return next();
  if (this.isModified('password'))
    this.password = bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// Compare candidate password to user password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user changed his password after the token was issued
userSchema.methods.passwordChangedAfter = function (jwtTimeStamp) {
  if (this.changedPasswordAt) {
    const changedPasswordTimeStamp = this.changedPasswordAt.getTime();

    // Means password was changed
    return jwtTimeStamp < changedPasswordTimeStamp;
  }
  // Means password was not changed
  // return false;
};

// Create reset password token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha265')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha265')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.passwordResetExpires);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
