const generateWallet = require("../src/scripts/generateWallet");

test("generate wallet", async () => {
  const result = await generateWallet();

  expect(result.privKey).toMatch(/0x*/);
  expect(result.pubKey).toMatch(/0x*/);
});
