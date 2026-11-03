import { createSelector } from 'reselect';
import get from 'lodash/get';
import { getIsValid, toValidationResult } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getDfspId } from 'App/selectors';
import { getAuthValidation } from './validators';
import { Operation, ALL } from './constants';

export const getUsername = state => state.auth.login.username;
export const getPassword = state => state.auth.login.password;
export const getIsAuthDisabled = state => state.auth.login.isDisabled;
export const getIsAuthFailed = state => state.auth.login.isFailed;
export const getAuthError = state => state.auth.login.error;
export const getJwt = state => state.auth.login.jwt;
export const getSession = state => state.auth.login.session;
export const getQRProps = state => state.auth.login.QRProps;
export const getExpiration = state => state.auth.login.expiration;
export const getHoldings = state => state.auth.login.holdings;
export const getHoldingsError = state => state.auth.login.holdingsError;

export const getSessionUserName = createSelector(getSession, session => get(session, 'name'));
export const getSessionUserEmail = createSelector(getSession, session => get(session, 'email'));

export const getCurrentUsername = createSelector(
  getSessionUserName,
  getSessionUserEmail,
  // An identity schema defines a name only when it wants one, so email is the
  // usual value.
  (name, email) => name || email
);

// With authentication off there is no caller to ask the IAM about, and the UI
// offers everything.
const reachOver = operationId =>
  createSelector(getIsAuthDisabled, getHoldings, (isAuthDisabled, holdings) =>
    isAuthDisabled ? ALL : get(holdings, operationId, [])
  );
const reaches = (reach, dfspId) => reach === ALL || reach.includes(dfspId);

export const getDfspsReach = reachOver(Operation.getDFSPs);
export const getIsHubOperator = createSelector(getDfspsReach, reach => reach === ALL);
export const getMaySeeDfsps = createSelector(getDfspsReach, reach => reach === ALL || reach.length > 0);
export const getMayManageCredentials = createSelector(reachOver(Operation.getCredentials), getDfspId, reaches);

const getAuthModel = createSelector(getUsername, getPassword, (username, password) => ({
  username,
  password,
}));
export const getValidationResult = createSelector(getAuthModel, getAuthValidation, toValidationResult);

export const getIsAuthSubmitEnabled = createSelector(getValidationResult, getIsValid);

export const getIsAuthPending = createPendingSelector('login.create');
