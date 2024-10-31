const { RuleTester } = require("eslint");
const rule = require("../src/rules/require-http-status");

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

ruleTester.run("require-http-status", rule, {
  valid: [
    {
      code: `
        import { HttpStatus } from '@nestjs/common';
        import { ApiResponse } from '@nestjs/swagger';
        
        class TestController {
          someMethod() {
            return { status: HttpStatus.OK };
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { ApiResponse } from '@nestjs/swagger';
        
        class TestController {
          someMethod() {
            return { status: 200 };
          }
        }
      `,
      errors: [
        "Missing HttpStatus import from @nestjs/common",
        "Use HttpStatus enum instead of numeric literal",
      ],
      output: `
        import { HttpStatus } from "@nestjs/common";
import { ApiResponse } from '@nestjs/swagger';
        
        class TestController {
          someMethod() {
            return { status: HttpStatus.OK };
          }
        }
      `,
    },
  ],
});
