import type { Config } from 'jest'

const config: Config = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/app/test/setup.ts"],
    testMatch: [
      "<rootDir>/app/**/__tests__/**/*.[jt]s?(x)",
      "<rootDir>/app/**/*.(spec|test).[jt]s?(x)"
    ],
    moduleNameMapper: {
      "^~/(.*)$": "<rootDir>/app/$1"
    }
};

// CommonJS module export
module.exports = config;
