// Load environment variables from parent directory .env file
require('dotenv').config({ path: '../.env' });

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = process.env.REACT_APP_CONFIG_PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/config', function (req, res) {
  let config = {
    API_BASE_URL: process.env.API_BASE_URL,
    AUTH_ENABLED: process.env.AUTH_ENABLED,
    CHECK_SESSION_URL: process.env.CHECK_SESSION_URL,
    LOGIN_URL: process.env.LOGIN_URL,
    LOGIN_PROVIDER: process.env.LOGIN_PROVIDER,
    LOGOUT_URL: process.env.LOGOUT_URL,
  };
  console.log('connection-manager-ui server: /config called, returning: ', config);
  res.send(config);
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log(`Starting connection-manager-ui server on port ${PORT}...`);
app.listen(PORT);
