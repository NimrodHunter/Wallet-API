const create = require("../src/services/hd_wallet/createHdWallet");
const getAccount = require("../src/services/hd_wallet/getAccount");

test("get account from  hd-wallet properly", async () => {
  const wallet = await create('artwork hurry grass point timber soon inner absurd alien october mention album');
  const account = getAccount(wallet, 10);
  console.log(account);

  expect(account.privKey).toMatch(/0x*/);
  expect(account.pubKey).toMatch(/0x*/);
});
