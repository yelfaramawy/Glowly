const mongoose = require('mongoose');
const redis = require('ioredis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  this.useCache = true;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    console.log('SERVING FROM MONGODB');
    return exec.apply(this, arguments);
  }
  // Combine the query with the collection name to create the key
  //? collection name is a string so we need to assign it to an Object
  const key = JSON.stringify(
    Object.assign({}, this.getFilter(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have any cached values for that key
  const cacheValue = await client.get(key);

  // If yes, return that
  if (cacheValue) {
    console.log('SERVING FROM CACHE');
    // create a mongoose document for the every index in the array from the cache
    return Array.isArray(JSON.parse(cacheValue))
      ? JSON.parse(cacheValue).map((obj) => new this.model(obj))
      : new this.model(JSON.parse(cacheValue));
  }

  // if no, exec the query and update the data in cache
  const result = await exec.apply(this, arguments);
  client.set(key, JSON.stringify(result));
  console.log('SERVING FROM MONGODB');
  return result;
};
