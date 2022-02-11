const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = async () => {
  let client;
  try {
    client = await redis.createClient();
  } catch (err) {
    process.exit(1);
  }
  return client;
};
