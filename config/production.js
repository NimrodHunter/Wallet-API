// const path = require("path");

module.exports = {
  NODE_ENV: "production",
  port: 8080,
  provider: process.env.BN_PROVIDER_MAIN,
  // ssl: {
  //   // https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
  //   rejectUnauthorized: false,
  //   key: path.join(__dirname, "..", "certificates", "key.pem"),
  //   cert: path.join(__dirname, "..", "certificates", "cert.pem"),
  // },
};
