const requireHttpStatus = require("./rules/require-http-status");

module.exports = {
  rules: {
    "require-http-status": requireHttpStatus,
  },
  configs: {
    recommended: {
      plugins: ["nestjs-apiresponse"],
      rules: {
        "nestjs-apiresponse/require-http-status": "error",
      },
    },
  },
};
