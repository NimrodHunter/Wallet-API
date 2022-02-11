const getWeb3 = require("../src/scripts/getWeb3");

test("get Web3 properly", async () => {
  const web3 = await getWeb3();

  expect(web3.currentProvider.host).toMatch(/https:*/);
});
