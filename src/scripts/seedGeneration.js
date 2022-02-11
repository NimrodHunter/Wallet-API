const bip39 = require("bip39");

module.exports = () => {
  return bip39.generateMnemonic();
};
