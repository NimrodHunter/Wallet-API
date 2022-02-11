const Web3 = require("web3");

module.exports = async provider => {
  let web3;
  if (provider) {
    web3 = new Web3(new Web3.providers.HttpProvider(provider));
  } else
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/qCvSKnMvg76cSOyichau"
      )
    );

  return web3;
};
