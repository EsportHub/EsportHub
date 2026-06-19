import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        describe:   "readonly",
        it:         "readonly",
        test:       "readonly",
        expect:     "readonly",
        beforeAll:  "readonly",
        afterAll:   "readonly",
        beforeEach: "readonly",
        afterEach:  "readonly",
      },
    },
  },
  {
    files: ["client/**/*.{js,jsx}"],
    rules: {
      "react/prop-types": "off",
      "no-unused-vars": "warn",
    },
  },
  prettierConfig,
];