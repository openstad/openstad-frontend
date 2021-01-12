// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.js'
  ],

  testRegex: "\\.test\\.js$",

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./test/setup.js'],

  // The test environment that will be used for testing
  testEnvironment: "node",
};
