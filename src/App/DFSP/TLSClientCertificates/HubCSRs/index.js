import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateCard,
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  MessageBox,
  PendingOverlay,
  Status,
} from 'components';
import { withMount } from 'utils/hocs';
import { isNil, isNotNil } from 'utils/testers';
import { getDfspName } from 'App/selectors';
import {
  storeDfspHubCsrs,
  submitCertificateDfspHubCsr,
  downloadDfspSentCsrCertificate,
  showDfspHubCsrsCertificateModal,
  hideDfspHubCsrsCertificateModal,
} from './actions';
import {
  getDfspHubCsrsError,
  getDfspHubCsrsCertificates,
  getDfspHubCsrsCertificateModalContent,
  getDfspHubCsrsCertificateModalTitle,
  getIsDfspHubCsrsCertificateModalVisible,
  getIsDfspHubCsrsPending,
  getIsDfspHubCsrCertificateSigningPendingByEnrollmentId,
} from './selectors';

import { VALIDATION_STATES } from 'App/Hub/constants';

import './index.css';

const stateProps = state => ({
  dfspName: getDfspName(state),
  error: getDfspHubCsrsError(state),
  csrs: getDfspHubCsrsCertificates(state),
  isCertificateModalVisible: getIsDfspHubCsrsCertificateModalVisible(state),
  certificateModalContent: getDfspHubCsrsCertificateModalContent(state),
  certificateModalTitle: getDfspHubCsrsCertificateModalTitle(state),
  isDfspHubCsrsPending: getIsDfspHubCsrsPending(state),
  isCertificateSigningPendingByEnrollmentId: getIsDfspHubCsrCertificateSigningPendingByEnrollmentId(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspHubCsrs()),
  onSignCSRClick: enrollmentId => dispatch(submitCertificateDfspHubCsr(enrollmentId)),
  onCertificateViewClick: (certificate, title) => dispatch(showDfspHubCsrsCertificateModal({ certificate, title })),
  onCertificateDownloadClick: (certificate, cn, extension) =>
    dispatch(downloadDfspSentCsrCertificate(certificate, cn, extension)),
  onCertificateModalCloseClick: () => dispatch(hideDfspHubCsrsCertificateModal()),
});

const HubCSRs = ({
  error,
  csrs,
  isCertificateModalVisible,
  certificateModalTitle,
  certificateModalContent,
  isDfspHubCsrsPending,
  isCertificateSigningPendingByEnrollmentId,
  onSignCSRClick,
  onCertificateViewClick,
  onCertificateDownloadClick,
  onCertificateModalCloseClick,
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
  } else if (!csrs.length) {
    return (
      <MessageBox
        icon="info-small"
        kind="default"
        message="There are no unprocessed Hub CSRs"
        size={30}
        fontSize={17}
        center
      />
    );
  }
  return (
    <div className="dfsp-hub-csrs">
      {isDfspHubCsrsPending && <PendingOverlay />}

      {csrs.map(({ certificate, certInfo, csr, csrInfo, state, validations, validationState, id }, index) => (
        <HubCSR
          key={index}
          index={index}
          enrollmentId={id}
          certificate={certificate}
          certInfo={certInfo}
          csr={csr}
          csrInfo={csrInfo}
          state={state}
          validations={validations}
          validationState={validationState}
          isCertificateSigningPending={isCertificateSigningPendingByEnrollmentId[id]}
          onSignCSRClick={onSignCSRClick}
          onViewClick={onCertificateViewClick}
          onDownloadClick={onCertificateDownloadClick}
        />
      ))}

      {isCertificateModalVisible && (
        <CertificateModal
          onClose={onCertificateModalCloseClick}
          content={certificateModalContent}
          title={certificateModalTitle}
        />
      )}
    </div>
  );
};

const HubCSR = ({
  index,
  enrollmentId,
  certificate,
  certInfo,
  csr,
  csrInfo,
  state,
  validations,
  validationState,
  isCertificateSigningPending,
  onSignCSRClick,
  onViewClick,
  onDownloadClick,
}) => (
  <CertificateCard.Box delay={index * 50}>
    <CertificateCard.Header>
      <CertificateCard.Details>
        <CertificateCard.PrimaryDetail>{csrInfo.subject.CN || 'Common Name'}</CertificateCard.PrimaryDetail>
        <Status.CSR state={state} />
      </CertificateCard.Details>
      <CertificateCard.Controls>
        <CertificateCard.ControlButton
          disabled={isNotNil(certificate) || validationState === VALIDATION_STATES.INVALID}
          label="Upload Certificate"
          icon="upload-small"
          onClick={() => onSignCSRClick(enrollmentId)}
          pending={isCertificateSigningPending}
        />
      </CertificateCard.Controls>
    </CertificateCard.Header>

    <CertificateCard.Content>
      <div className="dfsp-hub-csrs__certificate-validation">
        <CertificateValidation state={validationState} validations={validations} />
      </div>
      <CertificateInfo csrInfo={csrInfo} certInfo={certInfo} />
    </CertificateCard.Content>

    <CertificateCard.Footer>
      <CertificateCard.FooterButton
        icon="studio-project-small"
        label="View CSR"
        kind="secondary"
        noFill
        onClick={() => onViewClick(csr, 'CSR')}
      />
      <CertificateCard.FooterButton
        icon="download-small"
        label="Download CSR"
        noFill
        onClick={() => onDownloadClick(csr, csrInfo.subject.CN, '.csr')}
      />
      <CertificateCard.FooterButton
        icon="studio-project-small"
        label="View Certificate"
        kind="secondary"
        noFill
        onClick={() => onViewClick(certificate, 'Certificate')}
        disabled={isNil(certificate)}
      />
      <CertificateCard.FooterButton
        icon="download-small"
        label="Download Certificate"
        noFill
        onClick={() => onDownloadClick(certificate, certInfo.subject.CN, '.cer')}
        disabled={isNil(certificate)}
      />
    </CertificateCard.Footer>
  </CertificateCard.Box>
);

const MountedHubCSRs = withMount(HubCSRs, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedHubCSRs);
