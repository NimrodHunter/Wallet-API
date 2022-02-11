module.exports = {
  "extends": [
    "@tokenfoundry/eslint-config/babel",
    "plugin:react/recommended",
    "prettier/react",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "react",
  ],
};
