/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
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
    'src/**/*.{js,jsx,ts,tsx}',  // Include only files in the src folder
    '!src/**/*.test.{js,jsx,ts,tsx}',  // Exclude test files
    '!config-overrides.js', // Exclude config-overrides.js
    '!node_modules/**' // Exclude node_modules folder
  ],
  
  transformIgnorePatterns: ['/node_modules/'],
};
