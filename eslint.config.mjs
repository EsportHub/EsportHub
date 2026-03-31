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
      "react/react-in-jsx-scope": "off", // Для сучасного React це не потрібно
      "no-console": "warn",
    },
  },
  prettierConfig, // Вимикає правила ESLint, що заважають Prettier
];