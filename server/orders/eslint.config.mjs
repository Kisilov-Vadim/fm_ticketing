import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "object-curly-spacing": ["error", "never"], // No spaces inside curly braces
      "no-multiple-empty-lines": ["error", {max: 1}], // No more than 1 consecutive empty lines
      "indent": ["error", 2], // 2 spaces for indentation
      "brace-style": ["error", "1tbs", {"allowSingleLine": true}],
      "space-before-function-paren": ["error", {
        "anonymous": "always", // for anonymous functions
        "named": "never",      // for named functions
        "asyncArrow": "always" // for async arrow functions
      }]
    },
  },
];
