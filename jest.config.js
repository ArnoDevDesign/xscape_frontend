module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
};