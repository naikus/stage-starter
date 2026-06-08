import {defineConfig} from "eslint/config";

export default defineConfig([
  {
    name: "web",
    basePath: "./web",
    files: ["**/*.js"],
    extends: [
      "eslint:recommended",
      "plugins:solid/recommended"
    ],
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
      "no-unused-vars": ["warn" /*, {args: "none"}*/],
      "no-multiple-empty-lines": ["warn", {max: 4}],
      "comma-dangle": ["error", "never"]  
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
