import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  MessageBox,
  FileControls,
  FormInput,
} from 'components';
import { getEnvironmentName } from 'App/selectors';
import {
  changeDfspSCRootCertificate,
  downloadDfspSCRootCertificate,
  showDfspSCRootCertificateModal,
  hideDfspSCRootCertificateModal,
  changeDfspSCIntermediateChain,
  downloadDfspSCIntermediateChain,
  showDfspSCIntermediateChainModal,
  hideDfspSCIntermediateChainModal,
  changeDfspSCServerCertificate,
  downloadDfspSCServerCertificate,
  showDfspSCServerCertificateModal,
  hideDfspSCServerCertificateModal,
  submitDfspSCServerCertificate,
} from './actions';
import {
  getDfspSCError,
  getDfspSCRootCertificate,
  getDfspSCIntermediateChain,
  getDfspSCServerCertificate,
  getDfspSCRootCertificateInfo,
  getDfspSCIntermediateChainInfo,
  getDfspSCServerCertificateInfo,
  getDfspSCValidations,
  getDfspSCValidationState,
  getIsDfspSCRootCertificateModalVisible,
  getIsDfspSCIntermediateChainModalVisible,
  getIsDfspSCServerCertificateModalVisible,
  getIsDfspSCSubmitEnabled,
  getIsDfspSCSubmitPending,
  getIsDfspSCReadPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  environmentName: getEnvironmentName(state),
  error: getDfspSCError(state),
  rootCertificate: getDfspSCRootCertificate(state),
  intermediateChain: getDfspSCIntermediateChain(state),
  serverCertificate: getDfspSCServerCertificate(state),
  rootCertificateInfo: getDfspSCRootCertificateInfo(state),
  intermediateChainInfo: getDfspSCIntermediateChainInfo(state),
  serverCertificateInfo: getDfspSCServerCertificateInfo(state),
  validations: getDfspSCValidations(state),
  validationState: getDfspSCValidationState(state),
  isRootCertificateModalVisible: getIsDfspSCRootCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsDfspSCIntermediateChainModalVisible(state),
  isServerCertificateModalVisible: getIsDfspSCServerCertificateModalVisible(state),
  isSubmitEnabled: getIsDfspSCSubmitEnabled(state),
  isSubmitPending: getIsDfspSCSubmitPending(state),
  isReadPending: getIsDfspSCReadPending(state),
});

const actionProps = dispatch => ({
  onRootCertificateChange: cert => dispatch(changeDfspSCRootCertificate(cert)),
  onRootCertificateViewClick: () => dispatch(showDfspSCRootCertificateModal()),
  onRootCertificateDownloadClick: () => dispatch(downloadDfspSCRootCertificate()),
  onRootCertificateModalCloseClick: () => dispatch(hideDfspSCRootCertificateModal()),
  onIntermediateChainChange: cert => dispatch(changeDfspSCIntermediateChain(cert)),
  onIntermediateChainDownloadClick: () => dispatch(downloadDfspSCIntermediateChain()),
  onIntermediateChainViewClick: () => dispatch(showDfspSCIntermediateChainModal()),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspSCIntermediateChainModal()),
  onServerCertificateChange: cert => dispatch(changeDfspSCServerCertificate(cert)),
  onServerCertificateViewClick: () => dispatch(showDfspSCServerCertificateModal()),
  onServerCertificateDownloadClick: () => dispatch(downloadDfspSCServerCertificate()),
  onServerCertificateModalCloseClick: () => dispatch(hideDfspSCServerCertificateModal()),
  onCreateCertificateClick: () => dispatch(submitDfspSCServerCertificate()),
});

const DfspSC = ({
  environmentName,
  error,
  rootCertificate,
  intermediateChain,
  serverCertificate,
  rootCertificateInfo,
  intermediateChainInfo,
  serverCertificateInfo,
  validations,
  validationState,
  isRootCertificateModalVisible,
  isIntermediateChainModalVisible,
  isServerCertificateModalVisible,
  isSubmitEnabled,
  isSubmitPending,
  isReadPending,
  onRootCertificateChange,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainChange,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
  onServerCertificateChange,
  onServerCertificateViewClick,
  onServerCertificateDownloadClick,
  onServerCertificateModalCloseClick,
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
    <div className="dfsp__dfsp-sc">
      <div className="dfsp__dfsp-sc__submit__container">
        <Button
          className="dfsp__dfsp-sc__submit"
          label="Submit"
          onClick={onCreateCertificateClick}
          disabled={!isSubmitEnabled}
          pending={isSubmitPending}
          icon="check-small"
        />
      </div>

      <div className="dfsp__dfsp-sc__certificate-validation">
        <CertificateValidation validations={validations} state={validationState} type="certificate" />
      </div>

      <div className="dfsp__dfsp-sc__certificate-item">
        <div className="dfsp__dfsp-sc__server-certificate">
          <FormInput
            type="file"
            label="Server Certificate"
            parseFileAsText
            onChange={onServerCertificateChange}
            elementWidth="400px"
            value={serverCertificate || null}
            fileName={`${environmentName}-server.pem`}
            pending={isReadPending}
            required
          />
          {serverCertificate && (
            <FileControls
              onViewClick={onServerCertificateViewClick}
              onDownloadClick={onServerCertificateDownloadClick}
            />
          )}
        </div>
        {serverCertificateInfo && <CertificateInfo certInfo={serverCertificateInfo} />}
      </div>

      <div className="dfsp__dfsp-sc__certificate-item">
        <div className="dfsp__dfsp-sc__root-certificate">
          <FormInput
            type="file"
            label="Root Certificate"
            parseFileAsText
            onChange={onRootCertificateChange}
            elementWidth="400px"
            value={rootCertificate || null}
            fileName={`${environmentName}-root.pem`}
            pending={isReadPending}
          />
          {rootCertificate && (
            <FileControls onViewClick={onRootCertificateViewClick} onDownloadClick={onRootCertificateDownloadClick} />
          )}
        </div>
        {rootCertificateInfo && <CertificateInfo certInfo={rootCertificateInfo} />}
      </div>

      <div className="dfsp__dfsp-sc__certificate-item">
        <div className="dfsp__dfsp-sc__intermediate-chain">
          <FormInput
            type="file"
            label="Intermediate Chain"
            parseFileAsText
            onChange={onIntermediateChainChange}
            value={intermediateChain || null}
            fileName={`${environmentName}-intermediates.pem`}
            pending={isReadPending}
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
      {isServerCertificateModalVisible && (
        <CertificateModal
          onClose={onServerCertificateModalCloseClick}
          content={serverCertificate}
          title="Server Certificate"
        />
      )}
    </div>
  );
};
export default connect(
  stateProps,
  actionProps
)(DfspSC);
