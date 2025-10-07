import 'react-app-polyfill/stable';
import raf from './tests/dummy/polyfill';
import localstorage from './tests/dummy/localStorage';

// Set environment variables for tests
process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001';

// Mock window.location for tests
window.location = {
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost'
};
