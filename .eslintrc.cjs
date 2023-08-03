module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  env: {
    node: true
  },
  rules: {
    "@typescript-eslint/no-namespace": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
