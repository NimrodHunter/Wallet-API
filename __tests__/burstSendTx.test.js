const getWeb3 = require("../src/scripts/getWeb3");
const generateWallet = require("../src/scripts/generateWallet");
const send = require("../src/services/eth_private_transactions/send");
const contract = require("../artifacts/Whitelistable.json");
const redis = require("../src/scripts/redisConnection");
const initialNonce = require("../src/scripts/setInitialNonce");

test(
  "burst send transaction X times",
  async () => {
    const client = await redis();
    const web3 = await getWeb3();
    const wallet = await generateWallet();
    const contractAddress = "0x8270b7165c2EB171f4349cA54B25D7338dAee5F2";
    const contractMethod = "registerUser";
    const methodParams = ["0x971050461D01736b73b2A605f58b4cd09A5F6c20"];

    await initialNonce(wallet, web3);

    const X = 3;

    for (var i = 0; i < X; i++) {
      const result = await send(
        client,
        web3,
        wallet,
        contractAddress,
        contract,
        contractMethod,
        methodParams
      );
      expect(result).toMatch(/0x*/);
    }
  },
  50000
);
