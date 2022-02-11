const Wallet = require("ethereumjs-wallet");
const fs = require("fs");
const path = require("path");
const keystore = path.resolve(".wallet");

module.exports = async () => {
  const fname = path.join(keystore, "wallet.json".toLowerCase());
  let wallet;
  let pubKey;
  let privKey;

  if (!fs.existsSync(keystore)) {
    fs.mkdirSync(keystore);
    wallet = await Wallet.fromPrivateKey(Wallet.generate().getPrivateKey());

    pubKey = "0x" + wallet.getAddress().toString("hex");
    privKey = "0x" + wallet.getPrivateKey().toString("hex");

    fs.writeFileSync(fname, JSON.stringify({ pubKey, privKey }));
  } else {
    wallet = JSON.parse(fs.readFileSync(fname, "utf-8"));
    pubKey = wallet.pubKey;
    privKey = wallet.privKey;
  }

  return { pubKey, privKey };
};
