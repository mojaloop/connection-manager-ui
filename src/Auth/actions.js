import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import api from 'utils/api';
import { is200, is401, is500, is20x } from 'utils/http';
import { getLoginUrl, getLoginProvider, getLogoutUrl, getApiService } from 'App/selectors';
import { unsetDfsps } from 'App/actions';
import { getUsername, getPassword, getIsAuthDisabled } from './selectors';
import { AUTH_MESSAGES, Operation, ALL, HOLDINGS_MESSAGES } from './constants';

export const SET_AUTH_ENABLED = 'Auth / Enable';
export const SET_AUTH_DISABLED = 'Auth / Disable';
export const SET_AUTH_PENDING = 'Auth / Set Pending';
export const SET_AUTH_TOKEN = 'Auth / Set Token';
export const SET_SESSION = 'Auth / Set Session';
export const SET_AUTH_ERROR = 'Auth / Set Error';
export const SET_AUTH_QR_PROPS = 'Totp / Set QR Props';
export const CHANGE_USERNAME = 'Auth / Change Username';
export const CHANGE_PASSWORD = 'Auth / Change Password';
export const RESET_CREDENTIALS = 'Auth / Reset Credentials';
export const UNSET_AUTH_TOKEN = 'Auth / Unset Token';
export const UNSET_AUTH_QR_PROPS = 'Auth / Unset Auth QR Props';
export const SET_HOLDINGS = 'Auth / Set Holdings';
export const SET_HOLDINGS_ERROR = 'Auth / Set Holdings Error';

export const setAuthEnabled = createAction(SET_AUTH_ENABLED);
export const setAuthDisabled = createAction(SET_AUTH_DISABLED);
export const setAuthPending = createAction(SET_AUTH_PENDING);
export const setAuthToken = createAction(SET_AUTH_TOKEN);
export const setSession = createAction(SET_SESSION);
export const setAuthError = createAction(SET_AUTH_ERROR);
export const setAuthQRProps = createAction(SET_AUTH_QR_PROPS);
export const changeUsername = createAction(CHANGE_USERNAME);
export const changePassword = createAction(CHANGE_PASSWORD);
export const resetCredentials = createAction(RESET_CREDENTIALS);
export const unsetAuthToken = createAction(UNSET_AUTH_TOKEN);
export const unsetAuthQRProps = createAction(UNSET_AUTH_QR_PROPS);
export const setHoldings = createAction(SET_HOLDINGS);
export const setHoldingsError = createAction(SET_HOLDINGS_ERROR);

const isReach = scope => scope === ALL || (Array.isArray(scope) && scope.every(id => typeof id === 'string'));

// The DFSPs a held permission reaches: every operation asked about is scoped
// by the DFSP alone, so a held one names exactly one resource.
const reachOf = resources => {
  if (resources === undefined) {
    return [];
  }
  const scopes = Object.values(resources);
  return scopes.length === 1 && isReach(scopes[0]) ? scopes[0] : undefined;
};

export const storeHoldings = () => async (dispatch, getState) => {
  const state = getState();
  if (getIsAuthDisabled(state)) {
    return;
  }
  const service = getApiService(state);
  if (!service) {
    dispatch(setHoldingsError(HOLDINGS_MESSAGES.NOT_CONFIGURED));
    return;
  }
  const operations = Object.values(Operation);
  const permissionOf = operationId => `${service}.${operationId}`;
  const { data, status } = await dispatch(api.checkSession.read({}));
  if (!is20x(status)) {
    dispatch(setHoldingsError(HOLDINGS_MESSAGES.UNREADABLE));
    return;
  }
  const held = data?.identity?.metadata_public?.permissions || {};
  const reaches = operations.map(operationId => reachOf(held[permissionOf(operationId)]));
  if (reaches.includes(undefined)) {
    dispatch(setHoldingsError(HOLDINGS_MESSAGES.UNEXPECTED));
    return;
  }
  dispatch(setHoldings(Object.fromEntries(operations.map((operationId, index) => [operationId, reaches[index]]))));
};

export const login = () => async (dispatch, getState) => {
  const body = {
    username: getUsername(getState()),
    password: getPassword(getState()),
  };
  let error;
  let data;
  let status;
  try {
    ({ data, status } = await dispatch(api.login.create({ body })));
    if (is200(status)) {
      error = null;
    } else if (is500(status)) {
      error = AUTH_MESSAGES.SERVER_ERROR;
    } else if (is401(status)) {
      error = AUTH_MESSAGES.UNAUTHENTICATED;
    }
  } catch (e) {
    error = AUTH_MESSAGES.SERVER_ERROR;
  }

  if (error) {
    dispatch(setAuthError(error));
  } else if (data.token) {
    dispatch(setAuthToken(data.token.payload));
    dispatch(push('/'));
  } else {
    if (data.sharedSecret) {
      dispatch(
        setAuthQRProps({
          secret: data.sharedSecret,
          issuer: data.issuer,
          label: data.label,
        })
      );
    }
    dispatch(push('/login/2fa'));
  }
};

export const logout = () => async (dispatch, getState) => {
  const state = getState();
  const logoutUrl = getLogoutUrl(state);

  // Clear DFSP selection on logout for clean user experience
  dispatch(unsetDfsps());

  if (logoutUrl) {
    // Browser logout is two-step, the endpoint returns the flow as json and
    // navigating to its tokenized logout_url completes it
    const flowUrl = logoutUrl + '?return_to=' + encodeURIComponent(window.location.href);
    fetch(flowUrl, { headers: { accept: 'application/json' }, credentials: 'include' })
      .then(response => response.json())
      .then(({ logout_url }) => {
        window.location.assign(logout_url);
      });
  } else {
    await dispatch(api.logout.create());
    dispatch(unsetAuthToken());
    dispatch(push('/login'));
  }
};

export const check = () => async (dispatch, getState) => {
  const { data, status } = await dispatch(api.checkSession.read({}));
  if (is20x(status)) {
    dispatch(setSession(data?.identity?.traits || data));
  } else {
    const state = getState();
    const loginUrl = getLoginUrl(state) + '?return_to=' + encodeURIComponent(window.location.href);
    const loginProvider = getLoginProvider(state);
    if (!loginProvider) {
      window.location.assign(loginUrl);
      return;
    }
    fetch(loginUrl, {
      headers: { accept: 'application/json' },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(({ ui: { method, action, nodes }, ui }) => {
        const form = document.createElement('form');
        form.method = method;
        form.action = action;
        let submit = false;

        nodes.forEach(({ attributes: { type, name, node_type, value } }) => {
          if (name === 'provider' && value !== loginProvider) return;
          const element = document.createElement(node_type);
          if (name === 'provider') submit = element;
          element.type = type;
          element.value = value;
          element.name = name;
          form.appendChild(element);
        });

        if (submit) {
          document.body.appendChild(form);
          submit.click();
        } else {
          window.location.assign(loginUrl);
        }
      })
      .catch(console.error);
  }
};
