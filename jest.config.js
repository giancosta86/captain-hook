module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },

  testPathIgnorePatterns: ["/_.+", "<rootDir>/dist/"]
};
