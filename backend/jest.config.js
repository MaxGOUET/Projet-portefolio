module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middlewares/**/*.js",
    "services/**/*.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
