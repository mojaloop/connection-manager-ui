import React from 'react';
import { connect } from 'react-redux';
import { CertificateModal, MessageBox, FileControls, FormInput } from 'components';
import { withMount } from 'utils/hocs';
import { getDfspName } from 'App/selectors';
import {
  storeDfspHubCa,
  downloadDfspHubCaRootCertificate,
  showDfspHubCaRootCertificateModal,
  hideDfspHubCaRootCertificateModal,
} from './actions';
import {
  getDfspHubCaError,
  getDfspHubCaRootCertificate,
  getIsDfspHubCaRootCertificateModalVisible,
  getIsDfspHubCaPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  dfspName: getDfspName(state),
  error: getDfspHubCaError(state),
  rootCertificate: getDfspHubCaRootCertificate(state),
  isRootCertificateModalVisible: getIsDfspHubCaRootCertificateModalVisible(state),
  isDfspHubCaPending: getIsDfspHubCaPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspHubCa()),
  onRootCertificateViewClick: () => dispatch(showDfspHubCaRootCertificateModal()),
  onRootCertificateDownloadClick: () => dispatch(downloadDfspHubCaRootCertificate()),
  onRootCertificateModalCloseClick: () => dispatch(hideDfspHubCaRootCertificateModal()),
});

const HubCertificateAuthority = ({
  dfspName,
  error,
  rootCertificate,
  isRootCertificateModalVisible,
  isDfspHubCaPending,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
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
    <div className="dfsp__hub-ca">
      <div className="dfsp__hub-ca__root-certificate">
        <FormInput
          type="text"
          label="Root Certificate"
          elementWidth="400px"
          value={rootCertificate ? `${dfspName}-hub-root.pem` : 'Unavailable'}
          icon={rootCertificate && 'documents'}
          pending={isDfspHubCaPending}
          disabled
        />
        {rootCertificate && (
          <FileControls onViewClick={onRootCertificateViewClick} onDownloadClick={onRootCertificateDownloadClick} />
        )}
      </div>

      {isRootCertificateModalVisible && (
        <CertificateModal
          onClose={onRootCertificateModalCloseClick}
          content={rootCertificate}
          title="Root Certificate"
        />
      )}
    </div>
  );
};

const MountedHubCertificateAuthority = withMount(HubCertificateAuthority, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedHubCertificateAuthority);
