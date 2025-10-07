import './tests/dummy/polyfill';
import './tests/dummy/localStorage';

// Set environment variables for tests
process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001';

// Mock window.location for tests
window.location = {
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost'
};
