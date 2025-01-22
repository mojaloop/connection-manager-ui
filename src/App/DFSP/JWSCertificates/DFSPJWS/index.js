import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  FileControls,
  FormInput,
  MessageBox,
} from 'components';
import {
  changeDfspJWSJwsCertificate,
  downloadDfspJWSJwsCertificate,
  showDfspJWSJwsCertificateModal,
  hideDfspJWSJwsCertificateModal,
  changeDfspJWSIntermediateChain,
  downloadDfspJWSIntermediateChain,
  showDfspJWSIntermediateChainModal,
  hideDfspJWSIntermediateChainModal,
  submitDfspJWSCertificates,
} from './actions';
import {
  getDfspJWSError,
  getDfspJWSJwsCertificate,
  getDfspJWSIntermediateChain,
  getDfspJWSJwsCertificateInfo,
  getDfspJWSIntermediateChainInfo,
  getDfspJWSValidations,
  getDfspJWSValidationState,
  getIsDfspJWSJwsCertificateModalVisible,
  getIsDfspJWSIntermediateChainModalVisible,
  getIsDfspJWSSubmitEnabled,
  getIsDfspJWSSubmitPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getDfspJWSError(state),
  jwsCertificate: getDfspJWSJwsCertificate(state),
  intermediateChain: getDfspJWSIntermediateChain(state),
  jwsCertificateInfo: getDfspJWSJwsCertificateInfo(state),
  intermediateChainInfo: getDfspJWSIntermediateChainInfo(state),
  validations: getDfspJWSValidations(state),
  validationState: getDfspJWSValidationState(state),
  isJwsCertificateModalVisible: getIsDfspJWSJwsCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsDfspJWSIntermediateChainModalVisible(state),
  isSubmitEnabled: getIsDfspJWSSubmitEnabled(state),
  isSubmitPending: getIsDfspJWSSubmitPending(state),
});

const actionProps = dispatch => ({
  onJwsCertificateChange: cert => dispatch(changeDfspJWSJwsCertificate(cert)),
  onJwsCertificateViewClick: () => dispatch(showDfspJWSJwsCertificateModal()),
  onJwsCertificateDownloadClick: () => dispatch(downloadDfspJWSJwsCertificate()),
  onJwsCertificateModalCloseClick: () => dispatch(hideDfspJWSJwsCertificateModal()),
  onIntermediateChainChange: cert => dispatch(changeDfspJWSIntermediateChain(cert)),
  onIntermediateChainDownloadClick: () => dispatch(downloadDfspJWSIntermediateChain()),
  onIntermediateChainViewClick: () => dispatch(showDfspJWSIntermediateChainModal()),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspJWSIntermediateChainModal()),
  onCreateCertificateClick: () => dispatch(submitDfspJWSCertificates()),
});

const DfspJWS = ({
  error,
  jwsCertificate,
  intermediateChain,
  jwsCertificateInfo,
  intermediateChainInfo,
  validations,
  validationState,
  isJwsCertificateModalVisible,
  isIntermediateChainModalVisible,
  isSubmitEnabled,
  isSubmitPending,
  onJwsCertificateChange,
  onJwsCertificateViewClick,
  onJwsCertificateDownloadClick,
  onJwsCertificateModalCloseClick,
  onIntermediateChainChange,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
  onCreateCertificateClick,
}) => {
  if (error) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="danger"
        message="There was an error while loading the certificates"
        center
        size={30}
        fontSize={17}
      />
    );
  }

  return (
    <div className="dfsp__dfsp-jws">
      <div className="dfsp__dfsp-jws__submit__container">
        <Button
          className="dfsp__dfsp-jws__submit"
          label="Submit"
          onClick={onCreateCertificateClick}
          disabled={!isSubmitEnabled}
          pending={isSubmitPending}
          icon="check-small"
        />
      </div>

      <div className="dfsp__dfsp-jws__certificate-validation">
        <CertificateValidation validations={validations} state={validationState} type="certificate" />
      </div>

      <div className="dfsp__dfsp-jws__certificate-item">
        <div className="dfsp__dfsp-jws__jws-certificate">
          <FormInput
            type="file"
            label="JWS Certificate"
            parseFileAsText
            onChange={onJwsCertificateChange}
            elementWidth="400px"
            value={jwsCertificate || null}
            fileName={`jws.pem`}
            required
          />
          {jwsCertificate && (
            <FileControls onViewClick={onJwsCertificateViewClick} onDownloadClick={onJwsCertificateDownloadClick} />
          )}
        </div>
        {jwsCertificateInfo && <CertificateInfo certInfo={jwsCertificateInfo} />}
      </div>

      <div className="dfsp__dfsp-jws__certificate-item">
        <div className="dfsp__dfsp-jws__intermediate-chain">
          <FormInput
            type="file"
            label="Intermediate Chain"
            parseFileAsText
            onChange={onIntermediateChainChange}
            value={intermediateChain || null}
            fileName={`intermediates.pem`}
            elementWidth="400px"
          />
          {intermediateChain && (
            <FileControls
              onViewClick={onIntermediateChainViewClick}
              onDownloadClick={onIntermediateChainDownloadClick}
            />
          )}
        </div>
        {intermediateChainInfo && <CertificateInfo certInfo={intermediateChainInfo} />}
      </div>

      {isJwsCertificateModalVisible && (
        <CertificateModal onClose={onJwsCertificateModalCloseClick} content={jwsCertificate} title="JWS Certificate" />
      )}
      {isIntermediateChainModalVisible && (
        <CertificateModal
          onClose={onIntermediateChainModalCloseClick}
          content={intermediateChain}
          title="Intermediate Chain"
        />
      )}
    </div>
  );
};
export default connect(stateProps, actionProps)(DfspJWS);
