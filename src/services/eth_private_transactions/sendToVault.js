const sign = require("../vault/sign");
const auth = require("../vault/auth");
const vaultUri = "https://wallet-service.vault.azure.net/";
const WEB3 = require("../../scripts/getWeb3");

async function sendToVault() {
  const address = "0x5dedb6edbf7711fda4210c1a05eee8d5e4bd4dfb";
  const web3 = await WEB3();
  const gasPrice = web3.utils.toHex(await web3.eth.getGasPrice());
  const chainId = await web3.eth.net.getId();

  const transaction = {
    from: address,
    to: "0xa5652e6244F673cc20c9fb6BeD1572F62183aC8e",
    value: 1,
    gasPrice: gasPrice,
  };

  const gas = web3.utils.toHex(await web3.eth.estimateGas(transaction));

  transaction.gas = gas;
  transaction.chainId = chainId;

  transaction.nonce = web3.utils.toHex(
    await web3.eth.getTransactionCount(address)
  );

  console.log(transaction)

  const azureClient = await auth();

  const signedTransaction = await sign(
    transaction,
    transaction.chainId,
    azureClient,
    vaultUri,
    "account0",
    ""
  );

  return new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(`0x${signedTransaction.toString("hex")}`)
      .once("transactionHash", function(hash) {
        resolve(hash);
      })
      .on("error", function(error) {
        reject(error);
      });
  });
}

sendToVault().catch(console.log);

module.exports = sendToVault;
