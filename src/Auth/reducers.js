import { handleActions } from 'redux-actions';
import { setItem, getItem, removeItem } from 'utils/storage';
import { isDevelopment } from 'utils/env';

import {
  SET_AUTH_ENABLED,
  SET_AUTH_DISABLED,
  SET_AUTH_PENDING,
  SET_AUTH_TOKEN,
  SET_SESSION,
  SET_AUTH_ERROR,
  SET_AUTH_QR_PROPS,
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
  RESET_CREDENTIALS,
  UNSET_AUTH_TOKEN,
  UNSET_AUTH_QR_PROPS,
} from './actions';

const auth = isAuthEnabled => {
  const initialState = {
    isDisabled: isDevelopment ? !!getItem('auth_disabled') : !isAuthEnabled,
    isPending: false,
    username: undefined,
    password: undefined,
    // load from the localstorage for refresh purposes
    expiration: getItem('expiration'),
    jwt: getItem('auth_token'),
    session: undefined,
    QRProps: {
      secret: undefined,
      issuer: undefined,
      label: undefined,
    },
    isFailed: false,
    error: undefined,
  };

  const Auth = handleActions(
    {
      [SET_AUTH_ENABLED]: (state,) => {
        setItem('auth_disabled', false);
        return {
          ...state,
          isDisabled: false,
        };
      },
      [SET_AUTH_DISABLED]: (state,) => {
        setItem('auth_disabled', true);
        return {
          ...state,
          isDisabled: true,
        };
      },
      [SET_AUTH_PENDING]: (state, action) => ({
        ...state,
        isPending: action.payload,
        isFailed: false,
      }),
      [SET_SESSION]: (state, action) => ({
        ...state,
        session: action.payload,
        isFailed: false,
      }),
      [SET_AUTH_TOKEN]: (state, action) => {
        const utc = new Date().getTime();
        const { iat, exp } = action.payload;
        const expiration = utc + (exp - iat) * 1000;

        // store in the localstorage for refresh purposes
        setItem('auth_token', action.payload);
        setItem('expiration', expiration);

        return {
          ...state,
          expiration,
          jwt: action.payload,
          isFailed: false,
        };
      },
      [SET_AUTH_QR_PROPS]: (state, action) => ({
        ...state,
        QRProps: {
          secret: action.payload.secret,
          issuer: action.payload.issuer,
          label: action.payload.label,
        },
      }),
      [SET_AUTH_ERROR]: (state, action) => ({
        ...state,
        error: action.payload,
        isFailed: true,
      }),
      [CHANGE_USERNAME]: (state, action) => ({
        ...state,
        username: action.payload,
        isFailed: false,
      }),
      [CHANGE_PASSWORD]: (state, action) => ({
        ...state,
        password: action.payload,
        isFailed: false,
      }),
      [RESET_CREDENTIALS]: (state,) => ({
        ...state,
        username: initialState.username,
        password: initialState.password,
      }),
      [UNSET_AUTH_TOKEN]: (state,) => {
        // remove in the localstorage for refresh purposes
        removeItem('auth_token');
        removeItem('expiration');

        return {
          ...state,
          jwt: undefined,
          isFailed: false,
        };
      },
      [UNSET_AUTH_QR_PROPS]: (state, ) => ({
        ...state,
        QRProps: initialState.QRProps,
      }),
    },
    initialState
  );
  return Auth;
};
export default auth;
