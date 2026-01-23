import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  verbose: true,
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  moduleNameMapper: {
    "^@kernel/(.*)$": "<rootDir>/src/kernel/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@adapters/(.*)$": "<rootDir>/src/adapters/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
};

export default config;
