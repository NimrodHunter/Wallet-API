/* eslint no-console:0 */

"use strict";

const fs = require("fs");
const http = require("http");
const https = require("https");
const repl = require("repl");
const uws = require("uws");
const axios = require("axios");
const _ = require("lodash");
const { DateTime } = require("luxon");
const dedent = require("dedent");
const config = require("config");

const buildApp = require("./app");

const pkg = require("../package.json");

const genWallet = require("./scripts/generateWallet");
const getWeb3 = require("./scripts/getWeb3");
const redis = require("./scripts/redisConnection");
const initialNonce = require("../src/scripts/setInitialNonce");

async function start() {
  const wallet = await genWallet();
  const web3 = await getWeb3(config.get("provider"));
  const client = await redis();
  await initialNonce(wallet, web3);
  const options = {
    config,
    pkg,
    wallet,
    web3,
    client,
  };

  const app = await buildApp(options);

  const useREPL = !_.isEmpty(config.get("repl"));
  if (useREPL) {
    options.repl = repl.start(config.get("repl"));
    options.repl.context["lodash"] = _;
    options.repl.context["axios"] = axios;
    options.repl.context["config"] = config;
    options.repl.context["options"] = options;
    options.repl.context["app"] = app;
    options.repl.context["wallet"] = wallet;
    options.repl.context["web3"] = web3;
  }

  process.on("unhandledRejection", err => {
    const time = DateTime.local().toISO();
    console.error(`\nUnhandled Promise Rejection at ${time}`);
    console.error(err);
    if (useREPL) {
      console.log(`\nAvailable in the REPL: 'err' variable`);
      options.repl.context["err"] = err;
      options.repl.displayPrompt();
    }
  });

  app.on("error", (err, ctx) => {
    const time = DateTime.local().toISO();
    console.error(`\nServer Error at ${time}`);
    console.error(err);
    if (useREPL) {
      console.log(`\nAvailable in the REPL: 'ctx' and 'err' variables`);
      options.repl.context["ctx"] = ctx;
      options.repl.context["err"] = err;
      options.repl.displayPrompt();
    }
  });

  // Experimental uWebSockets support: https://github.com/uNetworking/uWebSockets
  const useUWS = config.get("uws");

  // Should use secure HTTPS connection (for production)
  const useSSL = !_.isEmpty(config.get("ssl"));

  const port = config.get("port");
  const SSL = () => {
    const ssl = config.get("ssl");
    return Object.assign({}, ssl, {
      key: fs.readFileSync(ssl.key),
      cert: fs.readFileSync(ssl.cert),
    });
  };

  if (useUWS && useSSL) {
    const listener = app.callback();
    const server = https.createServer(SSL(), listener);
    const wss = new uws.Server({ server, port, path: "/" });
    return { app, options, server, wss };
  } else if (useUWS) {
    const listener = app.callback();
    const server = http.createServer(listener);
    const wss = new uws.Server({ server, port, path: "/" });
    return { app, options, server, wss };
  } else if (useSSL) {
    const server = https.createServer(SSL(), app.callback()).listen(port);
    return { app, options, server };
  } else {
    const server = http.createServer(app.callback()).listen(port);
    return { app, options, server };
  }
}

// Export function for testing
exports.start = start;

// If this file is required, will not start the server
// Will start only when is the entry point of Node.js
if (typeof module != "undefined" && !module.parent) {
  start()
    .then(({ options }) => {
      const { config } = options;

      const protocol = _.isEmpty(config.get("ssl")) ? "http" : "https";

      const display = dedent`
        ${"=".repeat(process.stdout.columns)}

        App ${pkg.name} (${pkg.version}) running at:
        ${protocol}://${config.get("host")}:${config.get("port")}

        Program: Node.js ${process.version} @ ${process.platform}
        Process: '${process.title}' with pid: ${process.pid}
        Dir: ${__dirname}
        Entry point: ${__filename}

        Config (with NODE_ENV: ${config.get("NODE_ENV")}):
        <-- CONFIG -->

        Config sources (top has preference):
        ${config.util
          .getConfigSources()
          .reverse()
          .map(
            (source, i) => dedent`
              #${i}: ${source.name}
            `
          )
          .join("\n")}

        Routes:
        ${options.router &&
          options.router.router.stack
            .map(layer => `${layer.methods.join(" ")} ${layer.path}`)
            .join("\n")}

      `.replace("<-- CONFIG -->", JSON.stringify(config, null, 2));

      console.log(display);

      if (options.repl) {
        if (options.router) {
          options.repl.context["router"] = options.router.router;
        }
        const context = _.pickBy(options.repl.context, _.identity);

        console.log("\n-----------------");
        console.log("LIVE TERMINAL (REPL)");
        console.log(
          `\nVariables: ${[...Object.keys(context).reverse()].join(", ")}`
        );
        console.log(
          "\nPro-tip: the `_` variable is the output of the previous statement.\n"
        );
        options.repl.displayPrompt();
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
