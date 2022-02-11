const seedGen = require("../src/scripts/seedGeneration");
const bip39 = require("bip39");

test("generate seed properly", async () => {
  const seed = await seedGen();
  expect(bip39.validateMnemonic(seed)).toBeTruthy();
});
