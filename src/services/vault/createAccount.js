const auth = require("./auth");
const vaultUri = "https://wallet-service.vault.azure.net/";
const keccak = require("keccakjs");

async function createAccount(id) {
  const client = await auth();

  const key = await client.createKey(vaultUri, id, "EC-HSM", {
    curve: "SECP256k1",
    keyOps: ["sign"],
  });

  const pubKey = Buffer.concat([Uint8Array.from([4]), key.key.x, key.key.y]);

  const h = new keccak(256);
  h.update(pubKey.slice(1));

  return "0x" + h.digest("hex").slice(-40);
}

createAccount("test2");
module.exports = createAccount;
