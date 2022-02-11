/* eslint no-console:0 */

const _ = require("lodash");
const dedent = require("dedent");
const config = require("config");
const pkg = require("../package.json");

const protocol = _.isEmpty(config.get("ssl")) ? "http" : "https";

const display = dedent`
  App ${pkg.name} (${pkg.version}) running at:
  ${protocol}://${config.get("host")}:${config.get("port")}

  Program: Node.js ${process.version} @ ${process.platform}
  Process: '${process.title}' with pid: ${process.pid}
  Dir: ${__dirname}

  Do any test scripting setup here:
  ${__filename}

  Config (with NODE_ENV: ${config.get("NODE_ENV")}):
  <-- CONFIG -->

  Config sources (top has preference):
  ${config.util
    .getConfigSources()
    .reverse()
    .map((source, i) => `#${i}: ${source.name}`)
    .join("\n")}
`.replace("<-- CONFIG -->", JSON.stringify(config, null, 2));

/* Setup testing app here */

console.log(display);
