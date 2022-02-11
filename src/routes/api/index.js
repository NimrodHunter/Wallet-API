const { DateTime } = require("luxon");
const router = require("koa-joi-router");
const { Joi } = router;
const Boom = require("boom");

const send = require("../../services/eth_private_transactions/send.js");

const { unhandledErrors, handledErrors } = require("./_errors");

module.exports = async function buildAPI(app, options = {}) {
  const { pkg } = options;

  const r = router();

  // DANGER: Handle unhandled errors
  r.use(unhandledErrors(options));
  // Handle developer defined errors
  r.use(handledErrors(options));

  r.route({
    method: "GET",
    path: "/health",
    validate: {
      output: {
        200: {
          body: {
            status: Joi.string().required(),
            version: Joi.string().required(),
            time: Joi.string().required(),
          },
        },
      },
    },
    handler: async ctx => {
      ctx.body = {
        status: "on",
        version: pkg["version"],
        time: DateTime.local().toISO(),
      };
    },
  });

  r.route({
    method: "POST",
    path: "/send",
    validate: {
      output: {
        200: {
          body: {
            status: Joi.string().required(),
            version: Joi.string().required(),
            time: Joi.string().required(),
            hash: Joi.string().required(),
          },
        },
      },
    },
    handler: async ctx => {
      const contractAddress = ctx.req.params;
      const contractArtifact = ctx.req.body.contract_artifact;
      const contractMethod = ctx.req.body.contract_method;
      if (!contractAddress || !contractArtifact || !contractMethod) {
        throw Boom.badRequest(
          "You need to provide a contract address, artifact, method to send the transaction",
          {
            contractAddress,
            contractArtifact,
            contractMethod,
          }
        );
      }

      const methodParams = ctx.req.body.contract_params;
      for (let i = 1; i <= 3; i++) {
        try {
          const result = await send(
            options.client,
            options.web3,
            options.wallet,
            contractAddress,
            contractArtifact,
            contractMethod,
            methodParams
          );
          return (ctx.body = {
            hash: result,
          });
        } catch (err) {
          if (i === 3) {
            throw err;
          }
        }
      }
    },
  });

  return r;
};
