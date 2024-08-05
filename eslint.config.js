import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },

  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },

  {
    languageOptions: {
      globals: globals.browser
    }
  },

  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,

  pluginReactConfig,

  {
    plugins: {
      "react-hooks": reactHooksPlugin
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
