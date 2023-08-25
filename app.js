const path = require('path');
const express = require('express');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes.js');
const cartRouter = require('./routes/cartRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');

const app = express();

// Parse request body
app.use(express.json({ limit: '10kb' }));

// Set public path
app.use(express.static(path.join(__dirname, 'public')));

// app.use("/", userRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);

app.use(globalErrorHandler);

module.exports = app;
