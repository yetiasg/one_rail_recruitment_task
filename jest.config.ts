import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  verbose: true,
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@kernel/(.*)$": "<rootDir>/src/kernel/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@adapters/(.*)$": "<rootDir>/src/adapters/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@config/(.*)$": "<rootDir>/src/core/config/$1",
  },
};

export default config;
