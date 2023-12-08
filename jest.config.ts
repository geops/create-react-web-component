const config = {
  setupFiles: ["./jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/**/*.test.(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/template"],
  collectCoverage: true,
};
export default config;
