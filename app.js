const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes.js');
const cartRouter = require('./routes/cartRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const paymentRouter = require('./routes/paymentRoutes');
const AppError = require('./utils/AppError');
const cache = require('./utils/cache.js');

const app = express();

// Set public path
app.use(express.static(path.join(__dirname, 'public')));

// Parse request body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Security HTTP headers
app.use(helmet());

// Log incoming requests in development
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

// Setting rate limit for spamming requests from the same IP
app.use(
  rateLimit({
    max: 100,
    windowsMs: 60 * 60 * 1000,
    message: 'Too many request from this IP. Please ry again in an hour',
  })
);

// app.use("/", userRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/payments', paymentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
