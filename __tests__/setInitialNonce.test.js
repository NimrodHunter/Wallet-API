const initialNonce = require("../src/scripts/setInitialNonce");
const redis = require("../src/scripts/redisConnection");
const genWallet = require("../src/scripts/generateWallet");
const getWeb3 = require("../src/scripts/getWeb3");

test("if the wallet is created set the initial nonce", async () => {
  const wallet = await genWallet();
  const web3 = await getWeb3();
  await initialNonce(wallet, web3, "test-nonce");
  const client = await redis();

  const nonce = await client.getAsync("test-nonce");

  expect(parseInt(nonce)).toBeGreaterThanOrEqual(0);
});
