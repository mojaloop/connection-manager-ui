import React from 'react';
import { connect } from 'react-redux';
import { CertificateModal, CertificateValidation, FileControls, FormInput, Icon, MessageBox } from 'components';
import { getDfspName } from 'App/selectors';
import {
  changeDfspCaRootCertificateAndSubmit,
  downloadDfspCaRootCertificate,
  showDfspCaRootCertificateModal,
  hideDfspCaRootCertificateModal,
  changeDfspCaIntermediateChainAndSubmit,
  downloadDfspCaIntermediateChain,
  showDfspCaIntermediateChainModal,
  hideDfspCaIntermediateChainModal,
} from './actions';
import {
  getDfspCaError,
  getDfspCaRootCertificate,
  getDfspCaIntermediateChain,
  getDfspCaValidations,
  getDfspCaValidationState,
  getIsDfspCaRootCertificateModalVisible,
  getIsDfspCaIntermediateChainModalVisible,
  getIsDfspCaPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  dfspName: getDfspName(state),
  error: getDfspCaError(state),
  rootCertificate: getDfspCaRootCertificate(state),
  intermediateChain: getDfspCaIntermediateChain(state),
  validations: getDfspCaValidations(state),
  validationState: getDfspCaValidationState(state),
  isRootCertificateModalVisible: getIsDfspCaRootCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsDfspCaIntermediateChainModalVisible(state),
  isDfspCaPending: getIsDfspCaPending(state),
});

const actionProps = dispatch => ({
  onRootCertificateChange: cert => dispatch(changeDfspCaRootCertificateAndSubmit(cert)),
  onRootCertificateViewClick: () => dispatch(showDfspCaRootCertificateModal()),
  onRootCertificateDownloadClick: () => dispatch(downloadDfspCaRootCertificate()),
  onRootCertificateModalCloseClick: () => dispatch(hideDfspCaRootCertificateModal()),
  onIntermediateChainChange: cert => dispatch(changeDfspCaIntermediateChainAndSubmit(cert)),
  onIntermediateChainDownloadClick: () => dispatch(downloadDfspCaIntermediateChain()),
  onIntermediateChainViewClick: () => dispatch(showDfspCaIntermediateChainModal()),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspCaIntermediateChainModal()),
});

const DFSPCertificateAuthority = ({
  dfspName,
  error,
  rootCertificate,
  intermediateChain,
  validations,
  validationState,
  isRootCertificateModalVisible,
  isIntermediateChainModalVisible,
  isDfspCaPending,
  onRootCertificateChange,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainChange,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
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
    <div className="dfsp__dfsp-ca">
      <div className="dfsp__dfsp-ca__info-message">
        <Icon name="info-small" fill="#f49935" size={16} />
        <span className="dfsp__dfsp-ca__info-message__text">
          <b>Note: </b>
          If you do not upload a Root Certificate or Intermediate Chain then we assume you will be using a well known
          external CA
        </span>
      </div>

      <div className="dfsp__dfsp-ca__certificate-validation">
        <CertificateValidation type="ca" validations={validations} state={validationState} />
      </div>

      <div className="dfsp__dfsp-ca__root-certificate">
        <FormInput
          type="file"
          label="Root Certificate"
          parseFileAsText
          onChange={onRootCertificateChange}
          elementWidth="400px"
          value={rootCertificate || null}
          fileName={`${dfspName}-root.pem`}
          pending={isDfspCaPending}
        />
        {rootCertificate && (
          <FileControls onViewClick={onRootCertificateViewClick} onDownloadClick={onRootCertificateDownloadClick} />
        )}
      </div>
      <div className="dfsp__dfsp-ca__intermediate-chain">
        <FormInput
          type="file"
          label="Intermediate Chain"
          parseFileAsText
          onChange={onIntermediateChainChange}
          pending={isDfspCaPending}
          value={intermediateChain || null}
          fileName={`${dfspName}-intermediates.pem`}
          elementWidth="400px"
        />
        {intermediateChain && (
          <FileControls onViewClick={onIntermediateChainViewClick} onDownloadClick={onIntermediateChainDownloadClick} />
        )}
      </div>

      {isRootCertificateModalVisible && (
        <CertificateModal
          onClose={onRootCertificateModalCloseClick}
          content={rootCertificate}
          title="Root Certificate"
        />
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
export default connect(stateProps, actionProps)(DFSPCertificateAuthority);
