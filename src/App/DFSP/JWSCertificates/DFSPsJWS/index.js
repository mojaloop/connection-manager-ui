import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  Checkbox,
  FileControls,
  FormInput,
  MessageBox,
  TextField,
} from 'components';
import { withMount } from 'utils/hocs';
import {
  storeDfspsJWSCertificates,
  setDfspsJWSFilter,
  setDfspsJWSSameMonetaryZone,
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
  getDfspsJWSSameMonetaryZone,
  getFilteredDfspsJWSCertificatesByDfsp,
  getDfspsJWSJwsCertificateModalContent,
  getIsDfspsJWSJwsCertificateModalVisible,
  getDfspsJWSIntermediateChainModalContent,
  getIsDfspsJWSIntermediateChainModalVisible,
  getIsSameMonetaryZoneFilterEnabled,
  getIsDfspsJWSPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getDfspsJWSError(state),
  filter: getDfspsJWSFilter(state),
  sameMonetaryZone: getDfspsJWSSameMonetaryZone(state),
  certificatesByDfsp: getFilteredDfspsJWSCertificatesByDfsp(state),
  isJwsCertificateModalVisible: getIsDfspsJWSJwsCertificateModalVisible(state),
  jwsCertificateModalContent: getDfspsJWSJwsCertificateModalContent(state),
  isIntermediateChainModalVisible: getIsDfspsJWSIntermediateChainModalVisible(state),
  isSameMonetaryZoneFilterEnabled: getIsSameMonetaryZoneFilterEnabled(state),
  intermediateChainModalContent: getDfspsJWSIntermediateChainModalContent(state),
  isDfspsJWSPending: getIsDfspsJWSPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspsJWSCertificates()),
  onFilterChange: value => dispatch(setDfspsJWSFilter(value)),
  onSameMonetaryZoneChange: value => dispatch(setDfspsJWSSameMonetaryZone(value)),
  onJwsCertificateViewClick: cert => dispatch(showDfspsJWSJwsCertificateModal(cert)),
  onJwsCertificateDownloadClick: (cert, dfspName) => dispatch(downloadDfspsJWSJwsCertificate({ cert, dfspName })),
  onJwsCertificateModalCloseClick: () => dispatch(hideDfspsJWSJwsCertificateModal()),
  onIntermediateChainDownloadClick: (cert, dfspName) => dispatch(downloadDfspsJWSIntermediateChain({ cert, dfspName })),
  onIntermediateChainViewClick: cert => dispatch(showDfspsJWSIntermediateChainModal(cert)),
  onIntermediateChainModalCloseClick: () => dispatch(hideDfspsJWSIntermediateChainModal()),
});

const DFSPsJWS = ({
  error,
  filter,
  sameMonetaryZone,
  certificatesByDfsp,
  jwsCertificateModalContent,
  intermediateChainModalContent,
  isJwsCertificateModalVisible,
  isIntermediateChainModalVisible,
  isSameMonetaryZoneFilterEnabled,
  isDfspsJWSPending,
  onFilterChange,
  onSameMonetaryZoneChange,
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
        kind="danger"
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
      <div className="dfsp__dfsps-jws__filter">
        <Checkbox
          checked={sameMonetaryZone}
          onChange={onSameMonetaryZoneChange}
          disabled={!isSameMonetaryZoneFilterEnabled}
          label="Show only in the same monetary zone"
        />
      </div>

      <DFSPsCertificates
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
      isDownloadEnabled,
    } = certificate;
    const header = (
      <div className="dfsp__dfsps-jws__title">
        <span className="dfsp__dfsps-jws__name">{dfspName}</span>
        <span className="dfsp__dfsps-jws__spacing"> - </span>
      </div>
    );
    return (
      <div key={dfspId.toString()} className="dfsp__dfsps-jws__dfsp">
        {header}
        {error ? (
          <MessageBox
            icon="warning-sign"
            kind="danger"
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
                    downloadDisabled={!isDownloadEnabled}
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
