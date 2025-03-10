/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testTimeout: 30000, // 30 seconds per test
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json', isolatedModules: true }],
  },
  testEnvironment: 'jest-environment-node',
  reporters: ['default', ['jest-junit', { outputDirectory: './test/results/', outputName: 'xunit.xml' }]],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 90,
      functions: 90,
      branches: 90,
      lines: 90,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!config-overrides.js',
    '!node_modules/**'
  ],
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Add this line to specify your setup file
};
