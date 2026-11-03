const AUTH_MESSAGES = {
  SERVER_ERROR: `There was a problem with the authentication.
Please contact us if the error persists`,
  UNAUTHENTICATED: 'Invalid credentials',
};

// The connection manager API operations whose permissions decide what the UI
// offers; each permission is `<the API's IAM service>.<operationId>`
const Operation = Object.freeze({
  getDFSPs: 'getDFSPs',
  getCredentials: 'getCredentials',
});

const ALL = '$all';

const HOLDINGS_MESSAGES = Object.freeze({
  NOT_CONFIGURED: 'The IAM is not configured for this UI: API_AUTHZ_SERVICE is required.',
  UNREADABLE: 'Your permissions could not be read from your session.',
  UNEXPECTED: 'Your session holds permissions this UI does not understand.',
  NONE: 'You hold no permission to see DFSPs.',
});

export { AUTH_MESSAGES, Operation, ALL, HOLDINGS_MESSAGES };
