import React from 'react';
import { connect } from 'react-redux';
import { Button, CertificateModal, FileControls, FormInput } from 'components';
import { setDfspCsrCertificate, submitDfspCsr, showDfspCsrModal, hideDfspCsrModal } from './actions';
import {
  getDfspCsrCertificate,
  getIsDfspCsrModalVisible,
  getIsDfspCsrSubmitEnabled,
  getIsDfspCsrSubmitPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  certificate: getDfspCsrCertificate(state),
  isModalVisible: getIsDfspCsrModalVisible(state),
  isSubmitEnabled: getIsDfspCsrSubmitEnabled(state),
  isSubmitPending: getIsDfspCsrSubmitPending(state),
});

const actionProps = dispatch => ({
  onChange: cert => dispatch(setDfspCsrCertificate(cert)),
  onSubmit: () => dispatch(submitDfspCsr()),
  onViewClick: () => dispatch(showDfspCsrModal()),
  onModalCloseClick: () => dispatch(hideDfspCsrModal()),
});

const CSR = ({
  certificate,
  isModalVisible,
  isSubmitEnabled,
  isSubmitPending,
  onChange,
  onSubmit,
  onViewClick,
  onModalCloseClick,
}) => {
  return (
    <div className="dfsp__csr">
      <div>
        <Button
          className="dfsp__csr__submit"
          label="Submit"
          icon="check-small"
          onClick={onSubmit}
          pending={isSubmitPending}
          disabled={!isSubmitEnabled}
        />
      </div>
      <div className="dfsp__csr__csr">
        <FormInput
          type="file"
          label="CSR"
          parseFileAsText
          onChange={onChange}
          elementWidth="400px"
          value={certificate}
          required
        />
        {certificate && <FileControls onViewClick={onViewClick} />}
      </div>

      {isModalVisible && <CertificateModal title="CSR" onClose={onModalCloseClick} content={certificate} />}
    </div>
  );
};

export default connect(
  stateProps,
  actionProps
)(CSR);
