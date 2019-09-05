const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const otplib = require('otplib');

const enabled2fa = true;
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
let enrolled = false;

const RESPONSES = {
  'totp_not_enabled': {
    status: 200,
    data: {
      "sharedSecret": secret,
      "issuer": "MCM",
      "label": "devMCM",
      "enrolled": false,
      "2faEnabled": true
    }
  },
  'totp_enabled': { 
    status: 200,
    data: {
      "enrolled": true,
      "2faEnabled": true
    },
  },
  'not_authenticated': {
    status: 401,
    data: {
      message: 'Not authenticated'
    }
  },
  'auth_successful': {
    status: 200,
    data: {
      token: {
        payload: 'test'
      }
    }
  }
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/login', function (req, res) {

  const { username, password } = req.body;
  const isValid = username === 'test' && password === 'pass';
  
  if (isValid && !enabled2fa) {
    response = RESPONSES.auth_successful;
  } else if (isValid && enrolled) {
    response = RESPONSES.totp_enabled;
  } else if (isValid && !enrolled) {
    response = RESPONSES.totp_not_enabled;
  } else {
    response = RESPONSES.not_authenticated;
  }
  res.status(response.status);
  res.json(response.data);
});

app.post('/login2step', function (req, res) {

  const { username, password, generatedToken } = req.body;
  const isValid = username === 'test' && password === 'pass' && otplib.authenticator.check(generatedToken, secret);
  if (isValid) {
    if (!enrolled) {
      enrolled = true;
    }
    response = RESPONSES.auth_successful;
  } else {
    response = RESPONSES.not_authenticated;
  }
  res.status(response.status);
  res.json(response.data);
});

app.listen(8088);
