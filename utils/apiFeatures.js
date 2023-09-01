const Product = require('../models/productModel');

class APIFEeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    // 1A) Filter query object fields
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering add $ to operators
    let queryStr = JSON.stringify(queryObj);
    queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  // search() {
  //   const searchString = this.queryString.name.split('+').join(' ');
  //   this.query = this.query.find({ name: searchString });
  // }

  search() {
    if (this.queryString.name) {
      const searchString = this.queryString.name.split('+').join(' ');
      const searchRegExp = new RegExp(searchString, 'i');
      this.query = this.query.find({ name: searchRegExp });
    }
    return this;
  }
}

module.exports = APIFEeatures;
