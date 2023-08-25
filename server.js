const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DATABASE_NAME,
  })
  .then(console.log('Database connected successfully'))
  .catch((err) => {
    console.log(`Database connection failed: ${err}`);
  });

const port = process.env.PORT;

app.listen(port || 3000, () => {
  console.log(`App running on port ${port}`);
});
