import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  FileControls,
  FormInput,
  MessageBox,
  TextField,
} from 'components';
import { withMount } from 'utils/hocs';
import { getEnvironmentName } from 'App/selectors';
import {
  storeDfspsJWSCertificates,
  setDfspsJWSFilter,
  downloadDfspsJWSJwsCertificate,
  showDfspsJWSJwsCertificateModal,
  hideDfspsJWSJwsCertificateModal,
  downloadDfspsJWSIntermediateChain,
  showDfspsJWSIntermediateChainModal,
  hideDfspsJWSIntermediateChainModal,
} from './actions';
import {
  getDfspsJWSError,
  getDfspsJWSFilter,
  getFilteredDfspsJWSCertificatesByDfsp,
  getDfspsJWSJwsCertificateModalContent,
  getIsDfspsJWSJwsCertificateModalVisible,
  getDfspsJWSIntermediateChainModalContent,
  getIsDfspsJWSIntermediateChainModalVisible,
  getIsDfspsJWSPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  environmentName: getEnvironmentName(state),
  error: getDfspsJWSError(state),
  filter: getDfspsJWSFilter(state),
  certificatesByDfsp: getFilteredDfspsJWSCertificatesByDfsp(state),
  isJwsCertificateModalVisible: getIsDfspsJWSJwsCertificateModalVisible(state),
  jwsCertificateModalContent: getDfspsJWSJwsCertificateModalContent(state),
  isIntermediateChainModalVisible: getIsDfspsJWSIntermediateChainModalVisible(state),
  intermediateChainModalContent: getDfspsJWSIntermediateChainModalContent(state),
  isDfspsJWSPending: getIsDfspsJWSPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspsJWSCertificates()),
  onFilterChange: value => dispatch(setDfspsJWSFilter(value)),
  onJwsCertificateViewClick: cert => dispatch(showDfspsJWSJwsCertificateModal(cert)),
  onJwsCertificateDownloadClick: (cert, dfspName) => dispatch(downloadDfspsJWSJwsCertificate({ cert, dfspName })),
  onJwsCertificateModalCloseClick: () => dispatch(hideDfspsJWSJwsCertificateModal()),
  onIntermediateChainDownloadClick: (cert, dfspName) => dispatch(downloadDfspsJWSIntermediateChain({ cert, dfspName })),
  onIntermediateChainViewClick: cert => dispatch(showDfspsJWSIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspsJWSIntermediateChainModal()),
});

const DFSPsJWS = ({
  environmentName,
  error,
  filter,
  certificatesByDfsp,
  jwsCertificateModalContent,
  intermediateChainModalContent,
  isJwsCertificateModalVisible,
  isIntermediateChainModalVisible,
  isDfspsJWSPending,
  onFilterChange,
  onJwsCertificateViewClick,
  onJwsCertificateDownloadClick,
  onJwsCertificateModalCloseClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
  onIntermediateChainModalCloseClick,
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
    <div className="dfsp__dfsps-jws">
      <div className="dfsp__dfsps-jws__filter">
        <TextField placeholder="Search DFSP JWS Certificates" value={filter} onChange={onFilterChange} />
      </div>

      <DFSPsCertificates
        environmentName={environmentName}
        certificates={certificatesByDfsp}
        isDfspsJWSPending={isDfspsJWSPending}
        onJwsCertificateViewClick={onJwsCertificateViewClick}
        onJwsCertificateDownloadClick={onJwsCertificateDownloadClick}
        onIntermediateChainViewClick={onIntermediateChainViewClick}
        onIntermediateChainDownloadClick={onIntermediateChainDownloadClick}
      />

      {isJwsCertificateModalVisible && (
        <CertificateModal
          onClose={onJwsCertificateModalCloseClick}
          content={jwsCertificateModalContent}
          title="JWS Certificate"
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
};

const DFSPsCertificates = ({
  environmentName,
  certificates,
  isDfspsJWSPending,
  onJwsCertificateViewClick,
  onJwsCertificateDownloadClick,
  onIntermediateChainViewClick,
  onIntermediateChainDownloadClick,
}) => {
  if (!certificates.length) {
    return (
      <MessageBox icon="info-small" kind="default" message="There are no certificates" size={30} fontSize={17} center />
    );
  }
  return certificates.map(certificate => {
    const {
      dfspId,
      dfspName,
      error,
      jwsCertificate,
      intermediateChain,
      jwsCertificateInfo,
      intermediateChainInfo,
      validations,
      validationState,
    } = certificate;
    const header = (
      <div className="dfsp__dfsps-jws__title">
        <span className="dfsp__dfsps-jws__name">{dfspName}</span>
        <span className="dfsp__dfsps-jws__spacing"> - </span>
        <span className="dfsp__dfsps-jws__environment">{environmentName}</span>
      </div>
    );
    return (
      <div key={dfspId.toString()} className="dfsp__dfsps-jws__dfsp">
        {header}
        {error ? (
          <MessageBox
            icon="warning-sign"
            kind="error"
            message={`There was an error retrieving the ${dfspName}certificates`}
          />
        ) : (
          [
            <div className="dfsp__dfsps-jws__certificate-validation" key="validation">
              <CertificateValidation validations={validations} state={validationState} type="certificate" />
            </div>,
            <div className="dfsp__dfsps-jws__certificate-item" key="jws">
              <div className="dfsp__dfsps-jws__jws-certificate">
                <FormInput
                  type="text"
                  label="JWS Certificate"
                  elementWidth="400px"
                  value={jwsCertificate ? `${dfspName}-jws.pem` : 'No File Provided'}
                  icon={jwsCertificate && 'documents'}
                  pending={isDfspsJWSPending}
                  disabled
                />
                {jwsCertificate && (
                  <FileControls
                    onViewClick={() => onJwsCertificateViewClick(jwsCertificate)}
                    onDownloadClick={() => onJwsCertificateDownloadClick(jwsCertificate, dfspName)}
                  />
                )}
              </div>
              {jwsCertificateInfo && <CertificateInfo certInfo={jwsCertificateInfo} />}
            </div>,
            <div className="dfsp__dfsps-jws__certificate-item" key="chain">
              <div className="dfsp__dfsps-jws__intermediate-chain">
                <FormInput
                  type="text"
                  label="Intermediate Chain"
                  pending={isDfspsJWSPending}
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
            </div>,
          ]
        )}
      </div>
    );
  });
};

const MountedDFSPsJWS = withMount(DFSPsJWS, 'onMount');

export default connect(
  stateProps,
  actionProps
)(MountedDFSPsJWS);
