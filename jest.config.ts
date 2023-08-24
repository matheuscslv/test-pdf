import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testTimeout: 10000,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/controllers/services/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: 'src/tests/coverage',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
export default config;
