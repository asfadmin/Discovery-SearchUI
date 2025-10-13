// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      // ---------
      // re-enable these at some point
      // ---------
      "@typescript-eslint/no-explicit-any": [
        "off",
      ],
      "no-prototype-builtins": [
        "off"
      ],
      "@typescript-eslint/no-this-alias": [
        "off"
      ],
      "no-useless-escape": [
        "off"
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // ---------
      // re-enable these at some point
      // ---------
      "@angular-eslint/template/click-events-have-key-events":
        "off"
      ,
      "@angular-eslint/template/interactive-supports-focus":
        "off",
      "@angular-eslint/template/alt-text": "off",
      "@angular-eslint/template/no-negated-async": "off",
      "@angular-eslint/template/mouse-events-have-key-events": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
    },
  }
);