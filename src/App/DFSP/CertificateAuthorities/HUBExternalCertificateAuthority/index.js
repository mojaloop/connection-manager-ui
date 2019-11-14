import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  FileControls,
  FormInput,
  MessageBox,
} from 'components';
import {
  downloadDfspHubExternalCaRootCertificate,
  showDfspHubExternalCaRootCertificateModal,
  hideDfspHubExternalCaRootCertificateModal,
  downloadDfspHubExternalCaIntermediateChain,
  showDfspHubExternalCaIntermediateChainModal,
  hideDfspHubExternalCaIntermediateChainModal,
} from './actions';
import {
  getDfspHubExternalCaError,
  getDfspHubExternalCaCertificates,
  getIsDfspHubExternalCaRootCertificateModalVisible,
  getDfspHubExternalCaRootCertificateModalContent,
  getIsDfspHubExternalCaIntermediateChainModalVisible,
  getDfspHubExternalCaIntermediateChainModalContent,
  getIsDfspHubExternalCaReadPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getDfspHubExternalCaError(state),
  certificates: getDfspHubExternalCaCertificates(state),
  isRootCertificateModalVisible: getIsDfspHubExternalCaRootCertificateModalVisible(state),
  isIntermediateChainModalVisible: getIsDfspHubExternalCaIntermediateChainModalVisible(state),
  rootCertificateModalContent: getDfspHubExternalCaRootCertificateModalContent(state),
  intermediateChainModalContent: getDfspHubExternalCaIntermediateChainModalContent(state),
  isDfspHubExternalCaReadPending: getIsDfspHubExternalCaReadPending(state),
});

const actionProps = dispatch => ({
  onRootCertificateViewClick: cert => dispatch(showDfspHubExternalCaRootCertificateModal(cert)),
  onRootCertificateDownloadClick: (cert, name) => dispatch(downloadDfspHubExternalCaRootCertificate({ cert, name })),
  onRootCertificateModalCloseClick: () => dispatch(hideDfspHubExternalCaRootCertificateModal()),
  onIntermediateChainDownloadClick: (cert, name) =>
    dispatch(downloadDfspHubExternalCaIntermediateChain({ cert, name })),
  onIntermediateChainViewClick: cert => dispatch(showDfspHubExternalCaIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspHubExternalCaIntermediateChainModal()),
});

const DfspHubExternalUploadCertificateAuthority = ({
  error,
  certificates,
  isRootCertificateModalVisible,
  isIntermediateChainModalVisible,
  rootCertificateModalContent,
  intermediateChainModalContent,
  isDfspHubExternalCaReadPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
  onSubmit,
}) => {
  if (error) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="error"
        message="There was an error while loading the certificates"
        center
        size={30}
        fontSize={17}
      />
    );
  }

  return (
    <div className="dfsp__hub-external-ca">
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

      <ExtexnarlCaCertificates
        certificates={certificates}
        isPending={isDfspHubExternalCaReadPending}
        onRootCertificateViewClick={onRootCertificateViewClick}
        onRootCertificateDownloadClick={onRootCertificateDownloadClick}
        onIntermediateChainViewClick={onIntermediateChainViewClick}
        onIntermediateChainDownloadClick={onIntermediateChainDownloadClick}
      />
    </div>
  );
};

const ExtexnarlCaCertificates = ({
  certificates,
  isPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
}) => {
  if (!certificates.length) {
    return (
      <MessageBox
        icon="info-small"
        kind="default"
        message="There are no uploaded certificates"
        size={30}
        fontSize={17}
        center
      />
    );
  }
  return certificates.map(certificate => {
    const {
      name,
      rootCertificate,
      intermediateChain,
      rootCertificateInfo,
      intermediateChainInfo,
      validations,
      validationState,
    } = certificate;

    return (
      <div key={name} className="dfsp__hub-external-ca__certificates__certificate">
        <div className="dfsp__hub-external-ca__certificates__title">
          <span className="dfsp__hub-external-ca__certificates__name">{name}</span>
        </div>

        <div className="dfsp__hub-external-ca__certificates__certificate-validation" key="validation">
          <CertificateValidation validations={validations} state={validationState} type="certificate" />
        </div>

        <div className="dfsp__hub-external-ca__certificates__certificate-item" key="root">
          <div className="dfsp__hub-external-ca__certificates__root-certificate">
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

        <div className="dfsp__hub-external-ca__certificates__certificate-item" key="chain">
          <div className="dfsp__hub-external-ca__certificates__intermediate-chain">
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
  });
};

export default connect(
  stateProps,
  actionProps
)(DfspHubExternalUploadCertificateAuthority);
