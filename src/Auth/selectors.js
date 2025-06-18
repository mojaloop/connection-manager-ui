import { createSelector } from 'reselect';
import get from 'lodash/get';
import { getIsValid, toValidationResult } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getAuthValidation } from './validators';

export const getUsername = state => state.auth.login.username;
export const getPassword = state => state.auth.login.password;
export const getIsAuthDisabled = state => state.auth.login.isDisabled;
export const getIsAuthFailed = state => state.auth.login.isFailed;
export const getAuthError = state => state.auth.login.error;
export const getJwt = state => state.auth.login.jwt;
export const getSession = state => state.auth.login.session;
export const getQRProps = state => state.auth.login.QRProps;
export const getExpiration = state => state.auth.login.expiration;

// JWT-based selectors (legacy)
export const getLoggedDfspId = createSelector(getJwt, jwt => get(jwt, 'dfspId'));
export const getLoggedUsername = createSelector(getJwt, jwt => get(jwt, 'sub'));
export const getIsHubUser = createSelector(getJwt, jwt => {
  const groups = get(jwt, 'groups');
  if (!groups) {
    return false;
  }
  return groups.includes('Application/PTA');
});

// Session-based selectors (preferred for security)
// Session structure: { name: "DFSP Admin", email: "admin@mojaloop.io", roles: ["pta", "everyone"] }
export const getSessionUserName = createSelector(getSession, session => get(session, 'name'));
export const getSessionUserEmail = createSelector(getSession, session => get(session, 'email'));
export const getSessionUserRoles = createSelector(getSession, session => get(session, 'roles') || []);

export const getIsSessionHubUser = createSelector(getSessionUserRoles, roles => {
  if (!roles || !Array.isArray(roles)) return false;
  // Check for hub admin roles
  return roles.includes('pta') || roles.includes('mta') || roles.includes('Application/PTA') || roles.includes('Application/MTA');
});

export const getIsSessionDfspUser = createSelector(getSessionUserRoles, roles => {
  if (!roles || !Array.isArray(roles)) return false;
  // Check for DFSP user roles (e.g., 'Application/DFSP:MTN CI')
  return roles.some(role => role.startsWith('Application/DFSP'));
});

// Universal selectors that work with both JWT and session
export const getCurrentUsername = createSelector(
  getSessionUserName,
  getLoggedUsername,
  getSession,
  (sessionName, jwtUsername, session) => {
    // Prefer session data if available, fallback to JWT
    return session ? sessionName : jwtUsername;
  }
);

export const getCurrentUserRoles = createSelector(
  getSessionUserRoles,
  getSession,
  (sessionRoles, session) => {
    // Return session roles if available, empty array otherwise
    return session ? sessionRoles : [];
  }
);

export const getIsCurrentUserHubUser = createSelector(
  getIsSessionHubUser,
  getIsHubUser,
  getSession,
  (sessionIsHub, jwtIsHub, session) => {
    // Prefer session data if available, fallback to JWT
    return session ? sessionIsHub : jwtIsHub;
  }
);

export const getIsCurrentUserDfspUser = createSelector(
  getIsSessionDfspUser,
  getSession,
  (sessionIsDfsp, session) => {
    // Return session-based DFSP user check if available
    return session ? sessionIsDfsp : false;
  }
);

const getAuthModel = createSelector(getUsername, getPassword, (username, password) => ({
  username,
  password,
}));
export const getValidationResult = createSelector(getAuthModel, getAuthValidation, toValidationResult);

export const getIsAuthSubmitEnabled = createSelector(getValidationResult, getIsValid);

export const getIsAuthPending = createPendingSelector('login.create');
