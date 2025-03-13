/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
      '^@app/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json',
        isolatedModules: true 
      }],
    },
    testEnvironment: 'jest-environment-node',
  
    // Configure reporters for test results
    reporters: [
      'default',
      ['jest-junit', {outputDirectory: './test/results/', outputName: 'xunit.xml'}],
    ],
  
    // Automatically clear mock calls and instances between tests
    clearMocks: true,
  
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'text-summary', 'clover'],
  
    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
      global: {
        statements: 0,
        functions: 0,
        branches: 0,
        lines: 0,
      },
    },
  
    transformIgnorePatterns: [
      '/node_modules/',
  ],
  
  };