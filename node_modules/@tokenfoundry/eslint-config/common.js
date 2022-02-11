module.exports = {
  "extends": [
    "eslint:recommended",
    "prettier",
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
  },
  "env": {
    "node": true,
    "browser": true,
    "es6": true,
    "jest": true,
    "mocha": true,
  },
  "plugins": [
    "prettier",
  ],
  "rules": {
    "prettier/prettier": ["error", {
      printWidth: 80,
      trailingComma: "es5",
    }],
  },
};
