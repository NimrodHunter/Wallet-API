const Boom = require("boom");

exports.unhandledErrors = function unhandledErrors({ config }) {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // In development send the error to app.on("error") in app.js to debug it
      if (config.get("NODE_ENV") === "development") {
        ctx.status = 500;
        ctx.type = "text/html";
        ctx.body = err.stack;
        // Emit to app.on("error") at src/index.js
        ctx.app.emit("error", err, ctx);
      } else {
        // In production show a internal server error.
        console.error("DANGER: Unhandled Error:", err); // eslint-disable-line no-console
        ctx.status = 500;
        ctx.body = "Unknown Internal Server Error"; // do not render with React
      }
    }
  };
};

exports.handledErrors = function handledErrors() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.isJoi) {
        // eslint-disable-next-line no-ex-assign
        err = Boom.boomify(err, {
          statusCode: err.statusCode,
          data: err.details,
        });
      }
      // If unknown error, go to the upper handler
      if (!Boom.isBoom(err)) {
        throw err;
      }

      // Known error (we did throw the error), friendly user message here
      const code = err.output.statusCode;
      const message = err.message;

      ctx.status = code;
      ctx.body = { code, message };

      if (code < 400) {
        throw new Error("Should not happen");
      }
    }
  };
};
