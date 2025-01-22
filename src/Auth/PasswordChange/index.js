import React from 'react';
import { connect } from 'react-redux';
import { Button, FormInput, MessageBox } from 'components';
import './PasswordChange.scss';

import {
  getPasswordChangeOldPassword,
  getPasswordChangeNewPassword,
  getPasswordChangeConfirmPassword,
  getIsPasswordChangePending,
  getPasswordChangeError,
  getIsPasswordChangeSubmitEnabled,
  getValidationResult,
} from './selectors';

import {
  changePasswordChangeOldPassword,
  changePasswordChangeNewPassword,
  changePasswordChangeConfirmPassword,
  changePassword,
} from './actions';

const PasswordChange = ({
  oldPassword,
  newPassword,
  confirmPassword,
  validation,
  error,
  isSubmitEnabled,
  isAuthFailed,
  isAuthPending,
  onOldPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onPasswordChangeClick,
}) => (
  <div className="auth">
    <div className="auth__form">
      {isAuthFailed && <MessageBox icon="warning-sign" kind="danger" message={error} size={16} fontSize={14} />}

      <div className="auth__form__password">
        <FormInput
          type="text"
          placeholder="Old Password"
          value={oldPassword}
          onChange={onOldPasswordChange}
          validation={validation.fields.oldPassword}
          disabled={isAuthPending}
          autofocus={true}
        />
      </div>
      <div className="auth__form__password">
        <FormInput
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={onNewPasswordChange}
          validation={validation.fields.newPassword}
          disabled={isAuthPending}
        />
      </div>

      <div className="auth__form__password">
        <FormInput
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          validation={validation.fields.confirmPassword}
          disabled={isAuthPending}
        />
      </div>
      <div className="auth__form__submit">
        <Button
          kind="primary"
          label="Login"
          className="auth__form__submit__btn"
          disabled={!isSubmitEnabled}
          onClick={onPasswordChangeClick}
          pending={isAuthPending}
        />
      </div>
    </div>
  </div>
);

const stateProps = state => ({
  oldPassword: getPasswordChangeOldPassword(state),
  newPassword: getPasswordChangeNewPassword(state),
  confirmPassword: getPasswordChangeConfirmPassword(state),
  validation: getValidationResult(state),
  error: getPasswordChangeError(state),
  isAuthPending: getIsPasswordChangePending(state),
  isSubmitEnabled: getIsPasswordChangeSubmitEnabled(state),
});
const actionProps = dispatch => ({
  onOldPasswordChange: oldPassword => dispatch(changePasswordChangeOldPassword(oldPassword)),
  onNewPasswordChange: newPassword => dispatch(changePasswordChangeNewPassword(newPassword)),
  onConfirmPasswordChange: confirmPassword => dispatch(changePasswordChangeConfirmPassword(confirmPassword)),
  onPasswordChangeClick: () => dispatch(changePassword()),
});

export default connect(stateProps, actionProps)(PasswordChange);
