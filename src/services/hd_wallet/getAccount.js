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
const wallet = require("ethereumjs-wallet");

function getAccount(hdWallet, index) {
  const account = wallet.fromExtendedPrivateKey(
    hdWallet.deriveChild(index).privateExtendedKey()
  );

  const pubKey = "0x" + account.getAddress().toString("hex");
  const privKey = "0x" + account.getPrivateKey().toString("hex");

  return { pubKey, privKey };
}

module.exports = getAccount;
