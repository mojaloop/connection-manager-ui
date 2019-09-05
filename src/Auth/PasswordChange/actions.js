import { createAction } from 'redux-actions';
// import { push } from 'connected-react-router';
// import api from 'utils/api';
// import { is200, is401, is500 } from 'utils/http';
// import { getOldPassword, getNewPassword, getConfirmPassword } from './selectors';

export const SET_PASSWORD_CHANGE_ERROR = 'Auth / Set Error';
export const CHANGE_PASSWORD_CHANGE_OLD_PASSWORD = 'Password Change / Change Old Password';
export const CHANGE_PASSWORD_CHANGE_NEW_PASSWORD = 'Password Change / Change New Password';
export const CHANGE_PASSWORD_CHANGE_CONFIRM_PASSWORD = 'Password Change / Change Confirm Password';

export const changePasswordChangeOldPassword = createAction(CHANGE_PASSWORD_CHANGE_OLD_PASSWORD);
export const changePasswordChangeNewPassword = createAction(CHANGE_PASSWORD_CHANGE_NEW_PASSWORD);
export const changePasswordChangeConfirmPassword = createAction(CHANGE_PASSWORD_CHANGE_CONFIRM_PASSWORD);
export const setPasswordChangeAuthError = createAction(SET_PASSWORD_CHANGE_ERROR);

export const changePassword = () => () => {};
