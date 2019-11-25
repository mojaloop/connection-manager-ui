import { createSelector } from 'reselect';
import { getIsValid, toValidationResult } from '@modusbox/modusbox-ui-components/dist/redux-validation';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import { getPasswordChangeValidation } from './validators';

export const getPasswordChangeOldPassword = state => state.auth.password.oldPassword;
export const getPasswordChangeNewPassword = state => state.auth.password.newPassword;
export const getPasswordChangeConfirmPassword = state => state.auth.password.confirmPassword;
export const getPasswordChangeError = state => state.auth.password.error;

const getPasswordChangeModel = createSelector(
  getPasswordChangeOldPassword,
  getPasswordChangeNewPassword,
  getPasswordChangeConfirmPassword,
  (oldPassword, newPassword, confirmPassword) => ({
    oldPassword,
    newPassword,
    confirmPassword,
  })
);
export const getValidationResult = createSelector(
  getPasswordChangeModel,
  getPasswordChangeValidation,
  toValidationResult
);

export const getIsPasswordChangeSubmitEnabled = createSelector(
  getValidationResult,
  getIsValid
);

export const getIsPasswordChangePending = createPendingSelector('passwordChange.create');
