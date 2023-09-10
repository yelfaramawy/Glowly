const path = require('path');
const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes.js');
const cartRouter = require('./routes/cartRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');

const app = express();

// Set public path
app.use(express.static(path.join(__dirname, 'public')));

// Parse request body
app.use(express.json({ limit: '10kb' }));

// Log incoming requests in development
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

// app.use("/", userRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(globalErrorHandler);

module.exports = app;
