import {defineConfig} from "eslint/config";

export default defineConfig([
  {
    name: "web",
    basePath: "./web",
    files: ["**/*.js"],
    /*
    extends: [
      "eslint:recommended",
      "plugins:solid/recommended"
    ],
    */
    plugins: ["solid"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Promise: true
      }
    },
    rules: {
      semi: ["warn", "always"],
      quotes: ["warn", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true
      }],
      "keyword-spacing": ["warn", {
        "before": false,
        "after": false,
        "overrides": {
          "while": { "after": false },
          "return": { "after": true },
          "else": { "after": true, "before": false },
          "const": { "after": true },
          "case": { "after": true },
          "try": { "after": true }
        }
      }],
      "space-before-function-paren": [0, "never"],
      "indent": [2, 2, { "SwitchCase": 1, "VariableDeclarator": 2 }],
      "max-len": [1, {
        "code": 120,
        "tabWidth": 2,
        "ignoreUrls": true,
        "ignorePattern": "^goog\\.(module|require)"
      }],
      /*
      "require-jsdoc": [1, {
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true
        }
      }],
      "valid-jsdoc": [1, {
        "requireParamDescription": false,
        "requireReturnDescription": false,
        "requireReturn": false,
        "prefer": { "returns": "return" }
      }],
      */
      "no-unused-vars": ["warn"/* ,{args: "none"}*/],
      "no-multiple-empty-lines": ["warn", { max: 4 }],
      "comma-dangle": ["warn", "never"],
      "no-console": 0,
      "arrow-parens": ["warn", "as-needed", { "requireForBlockBody": false }],
      "one-var": [1, {
        "var": "consecutive",
        "let": "consecutive",
        "const": "consecutive"
      }],
      "no-trailing-spaces": "warn",
      "new-cap": "warn",
      "camelcase": "off"
    }
  }
]);

const old = {
    env: {
      browser: true,
      es2021: true
    },
    plugins: ["solid"],
    extends: ["eslint:recommended", "plugin:solid/recommended"],
    overrides: [
    ],
    globals: {
      document: true,
      navigator: true,
      window: true
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      semi: ["warn", "always"],
      quotes: ["warn", "double", {
        avoidEscape: true, 
        allowTemplateLiterals: true 
      }],
      "no-unused-vars": ["warn" /*, {args: "none"}*/],
      "no-multiple-empty-lines": ["warn", {max: 4}],
      "comma-dangle": ["error", "never"]  
    }
};
