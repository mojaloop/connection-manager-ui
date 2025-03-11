module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  moduleDirectories: [
    'node_modules',       // Default node_modules folder
    '<rootDir>/src',      // Look inside the 'src' directory for modules
  ],
  
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest', // for TypeScript files
    '^.+\\.js$': 'babel-jest', // for JavaScript files 
  },
  
  reporters: ['default', ['jest-junit', { outputDirectory: './test/results/', outputName: 'xunit.xml' }]],
  
  clearMocks: true,  // Automatically clear mock calls and instances
  collectCoverage: true,  // Collect test coverage information
  coverageDirectory: 'coverage',  // Directory to store coverage reports
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
    'src/**/*.{js,jsx}', // Include JavaScript and JSX files
    '!src/**/*.test.{js,jsx}', // Exclude test files
    '!config-overrides.js',
    '!node_modules/**',
  ],
  
  transformIgnorePatterns: [
    '/node_modules/(?!react-app-rewired|some-other-package-to-transform)/'
  ],
  
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],  // Path to setup files for tests
};
