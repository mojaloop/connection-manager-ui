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
  setHubExternalCaRootCertificate,
  downloadHubExternalCaRootCertificate,
  showHubExternalCaRootCertificateModal,
  hideHubExternalCaRootCertificateModal,
  setHubExternalCaIntermediateChain,
  downloadHubExternalCaIntermediateChain,
  showHubExternalCaIntermediateChainModal,
  hideHubExternalCaIntermediateChainModal,
  setHubExternalCaName,
  submitHubExternalCa,
} from './actions';
import {
  getHubExternalCaError,
  getHubExternalCaCertificate,
  getHubExternalCaRootCertificate,
  getHubExternalCaIntermediateChain,
  getHubExternalCaName,
  getHubExternalCaValidationResult,
  getIsHubExternalCaRootCertificateModalVisible,
  getHubExternalCaRootCertificateModalContent,
  getIsHubExternalCaIntermediateChainModalVisible,
  getHubExternalCaIntermediateChainModalContent,
  getIsHubExternalCaReadPending,
  getIsHubExternalCaCreatePending,
  getIsSubmitPending,
  getIsSubmitEnabled,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getHubExternalCaError(state),
  certificate: getHubExternalCaCertificate(state),
  rootCertificate: getHubExternalCaRootCertificate(state),
  intermediateChain: getHubExternalCaIntermediateChain(state),
  name: getHubExternalCaName(state),
  validation: getHubExternalCaValidationResult(state),
  isRootCertificateModalVisible: getIsHubExternalCaRootCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsHubExternalCaIntermediateChainModalVisible(state),
  rootCertificateModalContent: getHubExternalCaRootCertificateModalContent(state),
  intermediateChainModalContent: getHubExternalCaIntermediateChainModalContent(state),
  isHubExternalCaReadPending: getIsHubExternalCaReadPending(state),
  isHubExternalCaCreatePending: getIsHubExternalCaCreatePending(state),
  isSubmitPending: getIsSubmitPending(state),
  isSubmitEnabled: getIsSubmitEnabled(state),
});

const actionProps = dispatch => ({
  onRootCertificateChange: cert => dispatch(setHubExternalCaRootCertificate(cert)),
  onRootCertificateViewClick: cert => dispatch(showHubExternalCaRootCertificateModal(cert)),
  onRootCertificateDownloadClick: (content, name) => dispatch(downloadHubExternalCaRootCertificate(content, name)),
  onRootCertificateModalCloseClick: () => dispatch(hideHubExternalCaRootCertificateModal()),
  onIntermediateChainChange: cert => dispatch(setHubExternalCaIntermediateChain(cert)),
  onIntermediateChainDownloadClick: (content, name) => dispatch(downloadHubExternalCaIntermediateChain(content, name)),
  onIntermediateChainViewClick: cert => dispatch(showHubExternalCaIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideHubExternalCaIntermediateChainModal()),
  onIntermediateNameChange: name => dispatch(setHubExternalCaName(name)),
  onSubmit: () => dispatch(submitHubExternalCa()),
});

const HubExternalUploadCertificateAuthority = ({
  error,
  certificate,
  rootCertificate,
  intermediateChain,
  name,
  validation,
  isRootCertificateModalVisible,
  isIntermediateChainModalVisible,
  rootCertificateModalContent,
  intermediateChainModalContent,
  isHubExternalCaReadPending,
  isHubExternalCaCreatePending,
  isSubmitPending,
  isSubmitEnabled,
  onRootCertificateChange,
  onIntermediateNameChange,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainChange,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
  onSubmit,
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
    <div className="hub__hub-external-ca">
      <div>
        <Button
          className="hub__csr__submit"
          label="Submit"
          icon="check-small"
          onClick={onSubmit}
          pending={isSubmitPending}
          disabled={!isSubmitEnabled}
        />
      </div>

      <div className="hub__hub-external-ca__root-certificate">
        <FormInput
          type="file"
          label="Root Certificate"
          parseFileAsText
          onChange={onRootCertificateChange}
          validation={validation.fields.rootCertificate}
          elementWidth="400px"
          value={rootCertificate || null}
        />
        {rootCertificate && (
          <FileControls
            onViewClick={() => onRootCertificateViewClick(rootCertificate)}
            onDownloadClick={() => onRootCertificateDownloadClick(rootCertificate)}
          />
        )}
      </div>
      <div className="hub__hub-external-ca__intermediate-chain">
        <FormInput
          type="file"
          label="Intermediate Chain"
          parseFileAsText
          onChange={onIntermediateChainChange}
          validation={validation.fields.intermediateChain}
          value={intermediateChain || null}
          elementWidth="400px"
        />
        {intermediateChain && (
          <FileControls
            onViewClick={() => onIntermediateChainViewClick(intermediateChain)}
            onDownloadClick={() => onIntermediateChainDownloadClick(intermediateChain)}
          />
        )}
      </div>
      <div className="hub__hub-external-ca__name">
        <FormInput
          type="text"
          label="Name"
          onChange={onIntermediateNameChange}
          validation={validation.fields.name}
          value={name}
          elementWidth="400px"
        />
      </div>

      {isRootCertificateModalVisible && (
        <CertificateModal
          onClose={onRootCertificateModalCloseClick}
          content={rootCertificateModalContent}
          title="Root Certificate"
        />
      )}
      {isIntermediateChainModalVisible && (
        <CertificateModal
          onClose={onIntermediateChainModalCloseClick}
          content={intermediateChainModalContent}
          title="Intermediate Chain"
        />
      )}

      <ExternalCaCertificate
        certificate={certificate}
        isPending={isHubExternalCaReadPending}
        onRootCertificateViewClick={onRootCertificateViewClick}
        onRootCertificateDownloadClick={onRootCertificateDownloadClick}
        onIntermediateChainViewClick={onIntermediateChainViewClick}
        onIntermediateChainDownloadClick={onIntermediateChainDownloadClick}
      />
    </div>
  );
};

const ExternalCaCertificate = ({
  certificate,
  isPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
}) => {
  if (!certificate) {
    return (
      <MessageBox
        icon="info-small"
        kind="default"
        message="There is no uploaded certificate"
        size={30}
        fontSize={17}
        center
      />
    );
  }

  const {
    rootCertificate,
    intermediateChain,
    rootCertificateInfo,
    intermediateChainInfo,
    validations,
    validationState,
  } = certificate;

  const name = rootCertificateInfo.subject.CN;
  return (
    <div key={name} className="hub__hub-external-ca__certificates__certificate">
      <div className="hub__hub-external-ca__certificates__title">
        <span className="hub__hub-external-ca__certificates__name">{name}</span>
      </div>

      <div className="hub__hub-external-ca__certificates__certificate-validation" key="validation">
        <CertificateValidation validations={validations} state={validationState} type="certificate" />
      </div>

      <div className="hub__hub-external-ca__certificates__certificate-item" key="root">
        <div className="hub__hub-external-ca__certificates__root-certificate">
          <FormInput
            type="text"
            label="Root Certificate"
            elementWidth="400px"
            value={rootCertificate ? `${name}-root-cert.pem` : 'No File Provided'}
            icon={rootCertificate && 'documents'}
            pending={isPending}
            disabled
          />
          {rootCertificate && (
            <FileControls
              onViewClick={() => onRootCertificateViewClick(rootCertificate)}
              onDownloadClick={() => onRootCertificateDownloadClick(rootCertificate, name)}
            />
          )}
        </div>
        {rootCertificateInfo && <CertificateInfo certInfo={rootCertificateInfo} />}
      </div>

      <div className="hub__hub-external-ca__certificates__certificate-item" key="chain">
        <div className="hub__hub-external-ca__certificates__intermediate-chain">
          <FormInput
            type="text"
            label="Intermediate Chain"
            pending={isPending}
            value={intermediateChain ? `${name}-intermediates.pem` : 'No File Provided'}
            icon={intermediateChain && 'documents'}
            elementWidth="400px"
            disabled
          />
          {intermediateChain && (
            <FileControls
              onViewClick={() => onIntermediateChainViewClick(intermediateChain)}
              onDownloadClick={() => onIntermediateChainDownloadClick(intermediateChain, name)}
            />
          )}
        </div>
        {intermediateChainInfo && <CertificateInfo certInfo={intermediateChainInfo} />}
      </div>
    </div>
  );
};

export default connect(
  stateProps,
  actionProps
)(HubExternalUploadCertificateAuthority);
