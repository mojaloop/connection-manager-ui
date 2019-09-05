import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateModal,
  CertificateValidation,
  FileControls,
  FormInput,
  MessageBox,
  PendingOverlay,
} from 'components';
import { withMount } from 'utils/hocs';
import { getEnvironmentName } from 'App/selectors';
import {
  storeHubDfspCas,
  downloadHubDfspCaRootCertificate,
  showHubDfspCasRootCertificateModal,
  hideHubDfspCasRootCertificateModal,
  downloadHubDfspCaIntermediateChain,
  showHubDfspCasIntermediateChainModal,
  hideHubDfspCasIntermediateChainModal,
} from './actions';
import {
  getHubDfspCasError,
  getDfspCertificatesByDfsp,
  getHubDfspCasRootCertificateModalContent,
  getHubDfspCasIntermediateChainModalContent,
  getIsHubDfspCasRootCertificateModalVisible,
  getIsHubDfspCasIntermediateChainModalVisible,
  getIsHubDfspCasPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  environmentName: getEnvironmentName(state),
  error: getHubDfspCasError(state),
  certificatesByDfsp: getDfspCertificatesByDfsp(state),
  isRootCertificateModalVisible: getIsHubDfspCasRootCertificateModalVisible(state),
  rootCertificateModalContent: getHubDfspCasRootCertificateModalContent(state),
  isIntermediateChainModalVisible: getIsHubDfspCasIntermediateChainModalVisible(state),
  intermediateChainModalContent: getHubDfspCasIntermediateChainModalContent(state),
  isHubDfspCasPending: getIsHubDfspCasPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeHubDfspCas()),
  onRootCertificateViewClick: cert => dispatch(showHubDfspCasRootCertificateModal(cert)),
  onRootCertificateDownloadClick: (cert, dfspName) => dispatch(downloadHubDfspCaRootCertificate({ cert, dfspName })),
  onRootCertificateModalCloseClick: () => dispatch(hideHubDfspCasRootCertificateModal()),
  onIntermediateChainDownloadClick: (cert, dfspName) =>
    dispatch(downloadHubDfspCaIntermediateChain({ cert, dfspName })),
  onIntermediateChainViewClick: cert => dispatch(showHubDfspCasIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideHubDfspCasIntermediateChainModal()),
});

const DFSPCertificateAuthority = ({
  environmentName,
  error,
  certificatesByDfsp,
  isRootCertificateModalVisible,
  rootCertificateModalContent,
  isIntermediateChainModalVisible,
  intermediateChainModalContent,
  isHubDfspCasPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
}) => {
  let content = null;
  if (error) {
    content = (
      <MessageBox
        icon="warning-sign"
        kind="error"
        message="There was an error while loading the certificates"
        center
        size={30}
        fontSize={17}
      />
    );
  } else if (isHubDfspCasPending) {
    content = <PendingOverlay />;
  } else if (!certificatesByDfsp.length) {
    content = (
      <MessageBox icon="info-small" kind="default" message="There are no certificates" size={30} fontSize={17} center />
    );
  } else {
    content = (
      <div>
        {certificatesByDfsp.map(
          ({ dfspId, dfspName, error, rootCertificate, intermediateChain, validations, validationState }) => {
            const header = (
              <div className="hub__dfsp-ca__dfsp__title">
                <span className="hub__dfsp-ca__dfsp__name">{dfspName}</span>
                <span className="hub__dfsp-ca__dfsp__spacing"> - </span>
                <span className="hub__dfsp-ca__dfsp__environment">{environmentName}</span>
              </div>
            );
            return (
              <div key={dfspId.toString()} className="hub__dfsp-ca__dfsp">
                {header}
                {error ? (
                  <MessageBox
                    icon="warning-sign"
                    kind="error"
                    message={`There was an error retrieving the ${dfspName}certificates`}
                  />
                ) : (
                  [
                    <div className="hub__dfsp-ca__dfsp__certificate-validation" key="validation">
                      <CertificateValidation validations={validations} state={validationState} type="ca" />
                    </div>,
                    <div className="hub__dfsp-ca__dfsp__root-certificate" key="root">
                      <FormInput
                        type="text"
                        label="Root Certificate"
                        elementWidth="400px"
                        value={rootCertificate ? `${dfspName}-root.pem` : 'No File Provided'}
                        icon={rootCertificate && 'documents'}
                        disabled
                      />
                      {rootCertificate && (
                        <FileControls
                          onViewClick={() => onRootCertificateViewClick(rootCertificate)}
                          onDownloadClick={() => onRootCertificateDownloadClick(rootCertificate, dfspName)}
                        />
                      )}
                    </div>,
                    <div className="hub__dfsp-ca__dfsp__intermediate-chain" key="chain">
                      <FormInput
                        type="text"
                        label="Intermediate Chain"
                        value={intermediateChain ? `${dfspName}-intermediates.pem` : 'No File Provided'}
                        icon={intermediateChain && 'documents'}
                        elementWidth="400px"
                        disabled
                      />
                      {intermediateChain && (
                        <FileControls
                          onViewClick={() => onIntermediateChainViewClick(intermediateChain)}
                          onDownloadClick={() => onIntermediateChainDownloadClick(intermediateChain, dfspName)}
                        />
                      )}
                    </div>,
                  ]
                )}
              </div>
            );
          }
        )}

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
      </div>
    );
  }
  return <div className="hub__dfsp-ca">{content}</div>;
};

const MountedDFSPCertificateAuthority = withMount(DFSPCertificateAuthority, 'onMount');

export default connect(
  stateProps,
  actionProps
)(MountedDFSPCertificateAuthority);
