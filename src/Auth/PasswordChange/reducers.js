import { handleActions } from 'redux-actions';

import {
  CHANGE_PASSWORD_CHANGE_OLD_PASSWORD,
  CHANGE_PASSWORD_CHANGE_NEW_PASSWORD,
  CHANGE_PASSWORD_CHANGE_CONFIRM_PASSWORD,
  SET_PASSWORD_CHANGE_ERROR,
} from './actions';

const initialState = {
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
  // load from the localstorage for refresh purposes
  isFailed: false,
  error: undefined,
};

const PasswordChange = handleActions(
  {
    [CHANGE_PASSWORD_CHANGE_OLD_PASSWORD]: (state, action) => ({
      ...state,
      oldPassword: action.payload,
      isFailed: false,
    }),
    [CHANGE_PASSWORD_CHANGE_NEW_PASSWORD]: (state, action) => ({
      ...state,
      newPassword: action.payload,
      isFailed: false,
    }),
    [CHANGE_PASSWORD_CHANGE_CONFIRM_PASSWORD]: (state, action) => ({
      ...state,
      confirmPassword: action.payload,
      isFailed: false,
    }),
    [SET_PASSWORD_CHANGE_ERROR]: (state, action) => ({
      ...state,
      error: action.payload,
      isFailed: true,
    }),
  },
  initialState
);

export default PasswordChange;
export { initialState };
