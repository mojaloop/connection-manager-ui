import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import react from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";  // Import Babel parser

export default [
  js.configs.recommended,
  {
    parser: babelParser, // Set the Babel parser to handle JSX syntax
    parserOptions: {
      ecmaVersion: "latest", // Ensure you're using the latest ECMAScript version
      sourceType: "module",  // Ensure modules are enabled
      ecmaFeatures: {
        jsx: true,  // Enable JSX syntax
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      "react": react,  // React plugin
    },
    rules: {
      "constructor-super": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-console": "warn",
      "no-debugger": "warn",
      "react/prop-types": "off", // Optional: Disable Prop-types rule if you're using TypeScript or don't need them
    },
    globals: {
      describe: "readonly",
      beforeEach: "readonly",
      it: "readonly",
      expect: "readonly",
    },
  },
];
