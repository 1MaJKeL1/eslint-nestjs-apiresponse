module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce using HttpStatus enum in ApiResponse decorators and response objects",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    let hasHttpStatusImport = false;

    return {
      ImportDeclaration(node) {
        if (
          node.source.value === "@nestjs/common" &&
          node.specifiers.some(
            (specifier) =>
              specifier.type === "ImportSpecifier" &&
              specifier.imported.name === "HttpStatus"
          )
        ) {
          hasHttpStatusImport = true;
        }
      },

      ReturnStatement(node) {
        if (node.argument && node.argument.type === "ObjectExpression") {
          const statusProperty = node.argument.properties.find(
            (prop) =>
              prop.type === "Property" &&
              prop.key.type === "Identifier" &&
              prop.key.name === "status"
          );

          if (statusProperty && !hasHttpStatusImport) {
            context.report({
              node: node,
              message: "Missing HttpStatus import from @nestjs/common",
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                return fixer.insertTextBefore(
                  sourceCode.ast.body[0],
                  'import { HttpStatus } from "@nestjs/common";\n'
                );
              },
            });
          }

          if (
            statusProperty &&
            statusProperty.value.type === "Literal" &&
            typeof statusProperty.value.value === "number"
          ) {
            const { HttpStatus } = require("@nestjs/common");
            const statusValue = statusProperty.value.value;
            const enumKey = Object.entries(HttpStatus).find(
              ([_, value]) => value === statusValue
            )?.[0];

            if (enumKey) {
              context.report({
                node: statusProperty,
                message: "Use HttpStatus enum instead of numeric literal",
                fix(fixer) {
                  return fixer.replaceText(
                    statusProperty.value,
                    `HttpStatus.${enumKey}`
                  );
                },
              });
            }
          }
        }
      },

      Decorator(node) {
        if (
          node.expression.type === "CallExpression" &&
          node.expression.callee.type === "Identifier" &&
          node.expression.callee.name === "ApiResponse"
        ) {
          if (!hasHttpStatusImport) {
            context.report({
              node,
              message: "Missing HttpStatus import from @nestjs/common",
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const imports = sourceCode.ast.body.filter(
                  (node) =>
                    node.type === "ImportDeclaration" &&
                    node.source.value === "@nestjs/common"
                );

                if (imports.length > 0) {
                  const firstImport = imports[0];
                  return fixer.insertTextAfter(
                    firstImport.specifiers[firstImport.specifiers.length - 1],
                    ", HttpStatus"
                  );
                }

                return fixer.insertTextBefore(
                  sourceCode.ast.body[0],
                  'import { HttpStatus } from "@nestjs/common";\n'
                );
              },
            });
          }

          const options = node.expression.arguments[0];
          if (options && options.type === "ObjectExpression") {
            const statusProperty = options.properties.find(
              (prop) =>
                prop.type === "Property" &&
                prop.key.type === "Identifier" &&
                prop.key.name === "status"
            );

            if (
              statusProperty &&
              statusProperty.value.type === "Literal" &&
              typeof statusProperty.value.value === "number"
            ) {
              const { HttpStatus } = require("@nestjs/common");
              const statusValue = statusProperty.value.value;
              const enumKey = Object.entries(HttpStatus).find(
                ([_, value]) => value === statusValue
              )?.[0];

              if (enumKey) {
                context.report({
                  node: statusProperty,
                  message: "Use HttpStatus enum instead of numeric literal",
                  fix(fixer) {
                    return fixer.replaceText(
                      statusProperty.value,
                      `HttpStatus.${enumKey}`
                    );
                  },
                });
              }
            }
          }
        }
      },
    };
  },
};
