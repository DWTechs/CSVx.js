module.exports = {
  bail: true,
  clearMocks: true,
  coverageDirectory: "./tests/coverage",
  errorOnDeprecated: true,
  moduleFileExtensions: ["js", "mjs"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(checkard|@dwtechs)/)"],
  verbose: true,
};
