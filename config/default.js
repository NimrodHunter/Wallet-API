const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  NODE_ENV: "development",
  port: 3000,
  host: "localhost",
  proxy: false,
  silent: false,
  subdomainOffset: 0,
  uws: false,
  ssl: false,
  repl: false,
  debugging: Boolean(
    process.execArgv.find(
      param => param.includes("inspect-brk") || param.includes("inspect")
    )
  ),
  logHTTP: false,
  provider: process.env.BN_PROVIDER_TEST,
};
