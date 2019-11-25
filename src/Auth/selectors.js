import { createSelector } from 'reselect';
import get from 'lodash/get';
import { getIsValid, toValidationResult } from '@modusbox/modusbox-ui-components/dist/redux-validation';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import { getAuthValidation } from './validators';

export const getUsername = state => state.auth.login.username;
export const getPassword = state => state.auth.login.password;
export const getIsAuthDisabled = state => state.auth.login.isDisabled;
export const getIsAuthFailed = state => state.auth.login.isFailed;
export const getAuthError = state => state.auth.login.error;
export const getJwt = state => state.auth.login.jwt;
export const getQRProps = state => state.auth.login.QRProps;
export const getExpiration = state => state.auth.login.expiration;

export const getLoggedDfspId = createSelector(
  getJwt,
  jwt => get(jwt, 'dfspId')
);

export const getLoggedUsername = createSelector(
  getJwt,
  jwt => get(jwt, 'sub')
);

export const getIsHubUser = createSelector(
  getJwt,
  jwt => {
    const groups = get(jwt, 'groups');
    if (!groups) {
      return false;
    }
    return groups.includes('Application/PTA');
  }
);

const getAuthModel = createSelector(
  getUsername,
  getPassword,
  (username, password) => ({
    username,
    password,
  })
);
export const getValidationResult = createSelector(
  getAuthModel,
  getAuthValidation,
  toValidationResult
);

export const getIsAuthSubmitEnabled = createSelector(
  getValidationResult,
  getIsValid
);

export const getIsAuthPending = createPendingSelector('login.create');
