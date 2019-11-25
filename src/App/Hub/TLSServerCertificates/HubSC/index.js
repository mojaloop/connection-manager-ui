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
import { getEnvironmentName } from 'App/selectors';
import {
  changeHubSCRootCertificate,
  downloadHubSCRootCertificate,
  showHubSCRootCertificateModal,
  hideHubSCRootCertificateModal,
  changeHubSCIntermediateChain,
  downloadHubSCIntermediateChain,
  showHubSCIntermediateChainModal,
  hideHubSCIntermediateChainModal,
  changeHubSCServerCertificate,
  downloadHubSCServerCertificate,
  showHubSCServerCertificateModal,
  hideHubSCServerCertificateModal,
  submitHubSCServerCertificate,
} from './actions';
import {
  getHubSCError,
  getHubSCRootCertificate,
  getHubSCIntermediateChain,
  getHubSCServerCertificate,
  getHubSCRootCertificateInfo,
  getHubSCIntermediateChainInfo,
  getHubSCServerCertificateInfo,
  getHubSCValidations,
  getHubSCValidationState,
  getIsHubSCRootCertificateModalVisible,
  getIsHubSCIntermediateChainModalVisible,
  getIsHubSCServerCertificateModalVisible,
  getIsHubSCSubmitEnabled,
  getIsHubSCSubmitPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  environmentName: getEnvironmentName(state),
  error: getHubSCError(state),
  rootCertificate: getHubSCRootCertificate(state),
  intermediateChain: getHubSCIntermediateChain(state),
  serverCertificate: getHubSCServerCertificate(state),
  rootCertificateInfo: getHubSCRootCertificateInfo(state),
  intermediateChainInfo: getHubSCIntermediateChainInfo(state),
  serverCertificateInfo: getHubSCServerCertificateInfo(state),
  validations: getHubSCValidations(state),
  validationState: getHubSCValidationState(state),
  isRootCertificateModalVisible: getIsHubSCRootCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsHubSCIntermediateChainModalVisible(state),
  isServerCertificateModalVisible: getIsHubSCServerCertificateModalVisible(state),
  isSubmitEnabled: getIsHubSCSubmitEnabled(state),
  isSubmitPending: getIsHubSCSubmitPending(state),
});

const actionProps = dispatch => ({
  onRootCertificateChange: cert => dispatch(changeHubSCRootCertificate(cert)),
  onRootCertificateViewClick: () => dispatch(showHubSCRootCertificateModal()),
  onRootCertificateDownloadClick: () => dispatch(downloadHubSCRootCertificate()),
  onRootCertificateModalCloseClick: () => dispatch(hideHubSCRootCertificateModal()),
  onIntermediateChainChange: cert => dispatch(changeHubSCIntermediateChain(cert)),
  onIntermediateChainDownloadClick: () => dispatch(downloadHubSCIntermediateChain()),
  onIntermediateChainViewClick: () => dispatch(showHubSCIntermediateChainModal()),
  onIntermediateChainModalCloseClick: () => dispatch(hideHubSCIntermediateChainModal()),
  onServerCertificateChange: cert => dispatch(changeHubSCServerCertificate(cert)),
  onServerCertificateViewClick: () => dispatch(showHubSCServerCertificateModal()),
  onServerCertificateDownloadClick: () => dispatch(downloadHubSCServerCertificate()),
  onServerCertificateModalCloseClick: () => dispatch(hideHubSCServerCertificateModal()),
  onCreateCertificateClick: () => dispatch(submitHubSCServerCertificate()),
});

const HubSC = ({
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
    <div className="hub__hub-sc">
      <div className="hub__hub-sc__submit__container">
        <Button
          className="hub__hub-sc__submit"
          label="Submit"
          onClick={onCreateCertificateClick}
          disabled={!isSubmitEnabled}
          pending={isSubmitPending}
          icon="check-small"
        />
      </div>

      <div className="hub__hub-sc__certificate-validation">
        <CertificateValidation validations={validations} state={validationState} type="certificate" />
      </div>

      <div className="hub__hub-sc__certificate-item">
        <div className="hub__hub-sc__server-certificate">
          <FormInput
            type="file"
            label="Server Certificate"
            parseFileAsText
            onChange={onServerCertificateChange}
            elementWidth="400px"
            value={serverCertificate || null}
            fileName={`${environmentName}-server.pem`}
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

      <div className="hub__hub-sc__certificate-item">
        <div className="hub__hub-sc__root-certificate">
          <FormInput
            type="file"
            label="Root Certificate"
            parseFileAsText
            onChange={onRootCertificateChange}
            elementWidth="400px"
            value={rootCertificate || null}
            fileName={`${environmentName}-root.pem`}
          />
          {rootCertificate && (
            <FileControls onViewClick={onRootCertificateViewClick} onDownloadClick={onRootCertificateDownloadClick} />
          )}
        </div>
        {rootCertificateInfo && <CertificateInfo certInfo={rootCertificateInfo} />}
      </div>

      <div className="hub__hub-sc__certificate-item">
        <div className="hub__hub-sc__intermediate-chain">
          <FormInput
            type="file"
            label="Intermediate Chain"
            parseFileAsText
            onChange={onIntermediateChainChange}
            value={intermediateChain || null}
            fileName={`${environmentName}-intermediates.pem`}
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
)(HubSC);
