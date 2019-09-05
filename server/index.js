const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/config', function (req, res) {
  let config = {
    API_BASE_URL: process.env.API_BASE_URL,
    AUTH_ENABLED: process.env.AUTH_ENABLED,
  };
  console.log('connection-manager-ui server: /config called, returning: ', config);
  res.send(config);
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8080);
