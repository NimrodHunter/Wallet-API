const redis = require("../src/scripts/redisConnection");

test("redis connection properly", async () => {
  const client = await redis();

  expect(client.address).toMatch(/6379*/);
});
