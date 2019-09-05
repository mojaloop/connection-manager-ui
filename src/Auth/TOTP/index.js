import React from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode';
import { Button, Checkbox, FormInput, MessageBox } from 'components';
import { withMount } from 'utils/hocs';
import './TOTP.scss';

import { getQRProps, getUsername } from '../selectors';
import { unsetAuthQRProps } from '../actions';
import {
  getCode,
  getIsTotpPending,
  getIsQrScanAcknowledged,
  getIsTotpSubmitEnabled,
  getValidationResult,
} from './selectors';

import { acknowledgeQRScan, changeTotpCode, toptLogin, setup2fa } from './actions';

class TOTPQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64QRCode: null,
    };
  }
  async componentDidMount() {
    try {
      const { username, secret, issuer } = this.props;
      const label = `${username}@${window.location.host}`;
      const code = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
      const base64QRCode = await QRCode.toDataURL(code);

      this.setState({
        base64QRCode,
      });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const { base64QRCode } = this.state;
    const { isQrScanAcknowledged, onQRScanAcknowledge, onSecretConfirm } = this.props;
    if (!base64QRCode) {
      return null;
    }

    return (
      <div className="totp__confirm">
        <div className="totp__confirm__qr-layout">
          <img alt="QR CODE" className="totp__confirm__qr" src={base64QRCode} />
        </div>
        <MessageBox
          icon="warning-sign"
          kind="warning"
          message="This QR will be used to obtain a 6 digit code via an authenticator app"
          size={24}
          fontSize={15}
        />
        <div className="totp__confirm__ack">
          <Checkbox label="I have scanned the QR" checked={isQrScanAcknowledged} onChange={onQRScanAcknowledge} />
        </div>
        <div className="totp__confirm__submit">
          <Button
            kind="primary"
            label="Continue"
            className="totp__confirm__submit__btn"
            onClick={onSecretConfirm}
            disabled={!isQrScanAcknowledged}
          />
        </div>
      </div>
    );
  }
}

const TOTPForm = ({ code, validation, isSubmitEnabled, isTotpPending, onCodeChange, onCodeLogin }) => (
  <div className="totp__form">
    <div className="totp__form__code">
      <FormInput
        type="text"
        placeholder="Code"
        value={code}
        onChange={onCodeChange}
        validation={validation.fields.code}
        disabled={isTotpPending}
        autofocus={true}
      />
    </div>
    <div className="totp__form__submit">
      <Button
        kind="primary"
        label="Login"
        className="totp__form__submit__btn"
        disabled={!isSubmitEnabled}
        onClick={onCodeLogin}
        pending={isTotpPending}
      />
    </div>
  </div>
);

const TOTP = ({
  QRProps,
  username,
  code,
  validation,
  isSubmitEnabled,
  isTotpPending,
  isQrScanAcknowledged,
  onSecretConfirm,
  onQRScanAcknowledge,
  onCodeChange,
  onCodeLogin,
}) => {
  let content = null;
  if (QRProps.secret) {
    content = (
      <TOTPQR
        secret={QRProps.secret}
        issuer={QRProps.issuer}
        username={username}
        onSecretConfirm={onSecretConfirm}
        onQRScanAcknowledge={onQRScanAcknowledge}
        isQrScanAcknowledged={isQrScanAcknowledged}
      />
    );
  } else {
    content = (
      <TOTPForm
        code={code}
        validation={validation}
        isSubmitEnabled={isSubmitEnabled}
        isTotpPending={isTotpPending}
        onCodeChange={onCodeChange}
        onCodeLogin={onCodeLogin}
      />
    );
  }
  return <div className="totp">{content}</div>;
};

const stateProps = state => ({
  QRProps: getQRProps(state),
  username: getUsername(state),
  code: getCode(state),
  validation: getValidationResult(state),
  isTotpPending: getIsTotpPending(state),
  isQrScanAcknowledged: getIsQrScanAcknowledged(state),
  isSubmitEnabled: getIsTotpSubmitEnabled(state),
});
const actionProps = dispatch => ({
  onSecretConfirm: () => dispatch(unsetAuthQRProps()),
  onQRScanAcknowledge: value => dispatch(acknowledgeQRScan(value)),
  onCodeChange: code => dispatch(changeTotpCode(code)),
  onCodeLogin: () => dispatch(toptLogin()),
  onMount: () => dispatch(setup2fa()),
});

const MountedTOTP = withMount(TOTP, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedTOTP);
