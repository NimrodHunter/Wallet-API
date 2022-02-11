const fs = require("fs");
const path = require("path");
const keystore = path.resolve(".wallet");
const redis = require("./redisConnection");

module.exports = async (wallet, web3, name) => {
  if (fs.existsSync(keystore)) {
    const nonce = await web3.eth.getTransactionCount(wallet.pubKey);
    const client = await redis();
    if (name) await client.setAsync(name, nonce - 1);
    else await client.setAsync("nonce", nonce - 1);
  }
};
