import type { Rule, Linter } from "eslint";

declare module "eslint-nestjs-apiresponse" {
  const plugin: {
    rules: {
      "require-http-status": Rule.RuleModule;
    };
    configs: {
      recommended: {
        plugins: ["eslint-nestjs-apiresponse"];
        rules: {
          "eslint-nestjs-apiresponse/require-http-status": Linter.RuleLevel;
        };
      };
    };
  };
  export default plugin;
}
