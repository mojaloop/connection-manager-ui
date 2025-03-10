const js = require("@eslint/js");
const unusedImports = require("eslint-plugin-unused-imports");
const react = require("eslint-plugin-react");
const babelParser = require("@babel/eslint-parser");

module.exports = [
  js.configs.recommended,
  {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      "react": react,
    },
    rules: {
      "constructor-super": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-console": "warn",
      "no-debugger": "warn",
      "react/prop-types": "off", 
    },
    globals: {
      describe: "readonly",
      beforeEach: "readonly",
      it: "readonly",
      expect: "readonly",
    },
  },
];
