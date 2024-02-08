import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import api from 'utils/api';
import { is200, is401, is500, is20x } from 'utils/http';
import { getLoginUrl } from 'App/selectors';
import { getUsername, getPassword } from './selectors';
import { AUTH_MESSAGES } from './constants';

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
  await dispatch(api.logout.create());
  dispatch(unsetAuthToken());
  dispatch(push('/login'));
};

export const check = () => async (dispatch, getState) => {
  const { status, data } = await dispatch(api.checkSession.read({ }));
  console.log({status, data});
  if (is20x(status)) {
    dispatch(setSession(true));
  } else {
    window.location.assign(getLoginUrl(getState()));
  }
};