// See: https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  displayName: "test",
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.(spec|test).js"],
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageDirectory: "<rootDir>/coverage",
  setupFiles: ["<rootDir>/__tests__/init.js"],
};
