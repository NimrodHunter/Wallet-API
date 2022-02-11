const router = require("koa-joi-router");

const buildAPI = require("./api");

module.exports = async function buildRouter(app, options = {}) {
  const r = router();

  const subroutes = {
    api: await buildAPI(app, options),
  };

  r.use("/api", subroutes.api.middleware());

  return r;
};
