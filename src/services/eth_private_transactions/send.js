/**
 * @api {post} /send/:contract_address/ send a transaction to contract_address.
 * @apiVersion 0.0.1
 * @apiGroup Ethereum Transactions
 * @apiSuccess {String} transaction_hash The hash of the transaction fired.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *  "transaction_hash": "0x1234..."
 * }
 * @apiExample {curl} Example:
 *  curl -H "Content-Type: application/json" -X POST -d '{"contract_artifact":"0x1234...", "contract_method": "myMethod", "contract_params": [param1, param2, ...]}' http://localhost:3000/send/:contract_address/
 */

//Using HD Wallet
const Tx = require("ethereumjs-tx");

async function send(
  client,
  web3,
  wallet,
  contractAddress,
  contractArtifact,
  contractMethod,
  methodParams
) {
  const address = wallet.pubKey;
  const pkey = Buffer.from(wallet.privKey.slice(2), "hex");

  const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress);

  const transactionData = contract.methods[contractMethod](
    ...methodParams
  ).encodeABI();
  const gasPrice = web3.utils.toHex(await web3.eth.getGasPrice());
  const chainId = await web3.eth.net.getId();

  const transaction = {
    from: address,
    to: contractAddress,
    data: transactionData,
    gasPrice: gasPrice,
  };

  const gas = web3.utils.toHex(await web3.eth.estimateGas(transaction));

  transaction.gas = gas;
  transaction.chainId = chainId;

  const nonce = parseInt(await client.incrAsync("nonce"));

  transaction.nonce = web3.utils.toHex(nonce);

  const tx = new Tx(transaction);

  tx.sign(pkey);

  const signedTransaction = tx.serialize();

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

module.exports = send;
