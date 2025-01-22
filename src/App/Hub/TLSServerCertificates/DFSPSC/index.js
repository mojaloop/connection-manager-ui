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
import { withMount } from 'utils/hocs';
import {
  storeHubDfspSCServerCertificates,
  downloadHubDfspSCRootCertificate,
  showHubDfspSCRootCertificateModal,
  hideHubDfspSCRootCertificateModal,
  downloadHubDfspSCIntermediateChain,
  showHubDfspSCIntermediateChainModal,
  hideHubDfspSCIntermediateChainModal,
  downloadHubDfspSCServerCertificate,
  showHubDfspSCServerCertificateModal,
  hideHubDfspSCServerCertificateModal,
} from './actions';
import {
  getHubDfspSCError,
  getDfspCertificatesByDfsp,
  getHubDfspSCRootCertificateModalContent,
  getIsHubDfspSCRootCertificateModalVisible,
  getHubDfspSCIntermediateChainModalContent,
  getIsHubDfspSCIntermediateChainModalVisible,
  getHubDfspSCServerCertificateModalContent,
  getIsHubDfspSCServerCertificateModalVisible,
  getIsHubDfspSCPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getHubDfspSCError(state),
  certificatesByDfsp: getDfspCertificatesByDfsp(state),
  isRootCertificateModalVisible: getIsHubDfspSCRootCertificateModalVisible(state),
  rootCertificateModalContent: getHubDfspSCRootCertificateModalContent(state),
  isIntermediateChainModalVisible: getIsHubDfspSCIntermediateChainModalVisible(state),
  intermediateChainModalContent: getHubDfspSCIntermediateChainModalContent(state),
  isServerCertificateModalVisible: getIsHubDfspSCServerCertificateModalVisible(state),
  serverCertificateModalContent: getHubDfspSCServerCertificateModalContent(state),
  isHubDfspSCPending: getIsHubDfspSCPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeHubDfspSCServerCertificates()),
  onRootCertificateViewClick: cert => dispatch(showHubDfspSCRootCertificateModal(cert)),
  onRootCertificateDownloadClick: (cert, dfspName) => dispatch(downloadHubDfspSCRootCertificate({ cert, dfspName })),
  onRootCertificateModalCloseClick: () => dispatch(hideHubDfspSCRootCertificateModal()),
  onIntermediateChainDownloadClick: (cert, dfspName) =>
    dispatch(downloadHubDfspSCIntermediateChain({ cert, dfspName })),
  onIntermediateChainViewClick: cert => dispatch(showHubDfspSCIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideHubDfspSCIntermediateChainModal()),
  onServerCertificateViewClick: cert => dispatch(showHubDfspSCServerCertificateModal(cert)),
  onServerCertificateDownloadClick: (cert, dfspName) =>
    dispatch(downloadHubDfspSCServerCertificate({ cert, dfspName })),
  onServerCertificateModalCloseClick: () => dispatch(hideHubDfspSCServerCertificateModal()),
});

const DFSPSC = ({
  error,
  certificatesByDfsp,
  rootCertificateModalContent,
  intermediateChainModalContent,
  serverCertificateModalContent,
  isRootCertificateModalVisible,
  isIntermediateChainModalVisible,
  isServerCertificateModalVisible,
  isHubDfspSCPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
  onServerCertificateViewClick,
  onServerCertificateDownloadClick,
  onServerCertificateModalCloseClick,
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
  } else if (!certificatesByDfsp.length) {
    return (
      <MessageBox icon="info-small" kind="default" message="There are no certificates" size={30} fontSize={17} center />
    );
  }
  return (
    <div className="hub__dfsp-sc">
      {certificatesByDfsp.map(certificate => {
        const {
          dfspId,
          dfspName,
          serverCertificate,
          rootCertificate,
          intermediateChain,
          serverCertificateInfo,
          rootCertificateInfo,
          intermediateChainInfo,
          validations,
          validationState,
        } = certificate;
        return (
          <div key={dfspId.toString()} className="hub__dfsp-sc__dfsp">
            <div className="hub__dfsp-sc__dfsp__title">
              <span className="hub__dfsp-sc__dfsp__name">{dfspName}</span>
              <span className="hub__dfsp-sc__dfsp__spacing"> - </span>
            </div>

            <div className="hub__dfsp-sc__dfsp__certificate-validation" key="validation">
              <CertificateValidation validations={validations} state={validationState} />
            </div>

            <div className="hub__dfsp-sc__dfsp__certificate-item" key="server">
              <div className="hub__dfsp-sc__dfsp__server-certificate">
                <FormInput
                  type="text"
                  label="Server Certificate"
                  elementWidth="400px"
                  value={serverCertificate ? `${dfspName}-server.pem` : 'No File Provided'}
                  icon={serverCertificate && 'documents'}
                  pending={isHubDfspSCPending}
                  disabled
                />
                {serverCertificate && (
                  <FileControls
                    onViewClick={() => onRootCertificateViewClick(serverCertificate)}
                    onDownloadClick={() => onServerCertificateDownloadClick(serverCertificate, dfspName)}
                  />
                )}
              </div>
              {serverCertificateInfo && <CertificateInfo certInfo={serverCertificateInfo} />}
            </div>

            <div className="hub__dfsp-sc__dfsp__certificate-item" key="root">
              <div className="hub__dfsp-sc__dfsp__root-certificate">
                <FormInput
                  type="text"
                  label="Root Certificate"
                  elementWidth="400px"
                  value={rootCertificate ? `${dfspName}-root.pem` : 'No File Provided'}
                  icon={rootCertificate && 'documents'}
                  pending={isHubDfspSCPending}
                  disabled
                />
                {rootCertificate && (
                  <FileControls
                    onViewClick={() => onRootCertificateViewClick(rootCertificate)}
                    onDownloadClick={() => onRootCertificateDownloadClick(rootCertificate, dfspName)}
                  />
                )}
              </div>
              {rootCertificateInfo && <CertificateInfo certInfo={rootCertificateInfo} />}
            </div>

            <div className="hub__dfsp-sc__dfsp__certificate-item" key="chain">
              <div className="hub__dfsp-sc__dfsp__intermediate-chain">
                <FormInput
                  type="text"
                  label="Intermediate Chain"
                  pending={isHubDfspSCPending}
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
              </div>
              {intermediateChainInfo && <CertificateInfo certInfo={intermediateChainInfo} />}
            </div>
          </div>
        );
      })}

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
      {isServerCertificateModalVisible && (
        <CertificateModal
          onClose={onServerCertificateModalCloseClick}
          content={serverCertificateModalContent}
          title="Server Certificate"
        />
      )}
    </div>
  );
};

const MountedDFSPsSC = withMount(DFSPSC, 'onMount');

export default connect(stateProps, actionProps)(MountedDFSPsSC);
