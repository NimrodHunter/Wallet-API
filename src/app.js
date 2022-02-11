const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");

const buildRouter = require("./routes");

module.exports = async function buildApp(options = {}) {
  const { config } = options;

  const app = new Koa();

  app.env = config.get("NODE_ENV");
  app.proxy = config.get("proxy");
  app.silent = config.get("silent");
  app.subdomainOffset = config.get("subdomainOffset");

  if (config.get("logHTTP")) {
    app.use(logger());
  }
  app.use(bodyParser());

  const router = await buildRouter(app, options);
  options.router = router;

  app.use(router.middleware());

  return app;
};
