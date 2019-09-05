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
  TextField,
} from 'components';
import { withMount } from 'utils/hocs';
import { getDfspName } from 'App/selectors';
import { STATES } from '../constants';
import {
  storeHubSentCsrs,
  changeHubSentCsrsFilter,
  downloadHubSentCsrCertificate,
  validateHubSentCsrCertificate,
  showHubSentCsrsCertificateModal,
  hideHubSentCsrsCertificateModal,
} from './actions';
import {
  getHubSentCsrsError,
  getHubSentCsrsFilter,
  getFilteredHubSentCsrsCertificatesByDFSP,
  getHubSentCsrsCertificateModalContent,
  getHubSentCsrsCertificateModalTitle,
  getIsHubSentCsrsCertificateModalVisible,
  getIsHubSentCsrsPending,
  getIsHubSentCsrsValidateCertificatePendingByDfspId,
} from './selectors';

import './index.css';

const stateProps = state => ({
  dfspName: getDfspName(state),
  error: getHubSentCsrsError(state),
  csrs: getFilteredHubSentCsrsCertificatesByDFSP(state),
  filter: getHubSentCsrsFilter(state),
  certificateModalContent: getHubSentCsrsCertificateModalContent(state),
  certificateModalTitle: getHubSentCsrsCertificateModalTitle(state),
  isCertificateModalVisible: getIsHubSentCsrsCertificateModalVisible(state),
  isCsrsPending: getIsHubSentCsrsPending(state),
  isValidateCertificatePendingById: getIsHubSentCsrsValidateCertificatePendingByDfspId(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeHubSentCsrs()),
  onFilterChange: value => dispatch(changeHubSentCsrsFilter(value)),
  onCertificateViewClick: (certificate, title) => dispatch(showHubSentCsrsCertificateModal({ certificate, title })),
  onCertificateDownloadClick: (certificate, dfspName, extension) =>
    dispatch(downloadHubSentCsrCertificate(certificate, dfspName, extension)),
  onCertificateValidateClick: (dfspId, enrollmentId) => dispatch(validateHubSentCsrCertificate(dfspId, enrollmentId)),
  onCertificateModalCloseClick: () => dispatch(hideHubSentCsrsCertificateModal()),
});

const SentCSRsContainer = ({
  error,
  csrs,
  filter,
  certificateModalContent,
  certificateModalTitle,
  isCertificateModalVisible,
  isCsrsPending,
  isValidateCertificatePendingById,
  onFilterChange,
  onCertificateViewClick,
  onCertificateDownloadClick,
  onCertificateValidateClick,
  onCertificateModalCloseClick,
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
  } else {
    content = (
      <div>
        {isCsrsPending && <PendingOverlay />}
        <div className="hub-sent-csrs__filter">
          <TextField placeholder="Search Sent CSRs" value={filter} onChange={onFilterChange} />
        </div>

        <SentCSRs
          csrs={csrs}
          certificateModalContent={certificateModalContent}
          certificateModalTitle={certificateModalTitle}
          isCertificateModalVisible={isCertificateModalVisible}
          isValidateCertificatePendingById={isValidateCertificatePendingById}
          onCertificateViewClick={onCertificateViewClick}
          onCertificateDownloadClick={onCertificateDownloadClick}
          onCertificateValidateClick={onCertificateValidateClick}
          onCertificateModalCloseClick={onCertificateModalCloseClick}
        />
      </div>
    );
  }
  return <div className="hub-sent-csrs">{content}</div>;
};

const SentCSRs = ({
  csrs,
  certificateModalContent,
  certificateModalTitle,
  isCertificateModalVisible,
  isValidateCertificatePendingById,
  onCertificateViewClick,
  onCertificateDownloadClick,
  onCertificateValidateClick,
  onCertificateModalCloseClick,
}) => {
  if (!csrs.length) {
    return (
      <MessageBox icon="info-small" kind="default" message="There are no sent CSRs" size={30} fontSize={17} center />
    );
  }
  return (
    <div>
      {csrs.map(
        ({ id, dfspId, dfspName, certificate, certInfo, csr, csrInfo, state, validations, validationState }, index) => (
          <SentCSR
            key={index}
            index={index}
            dfspName={dfspName}
            certificate={certificate}
            csr={csr}
            csrInfo={csrInfo}
            certInfo={certInfo}
            state={state}
            validations={validations}
            validationState={validationState}
            isValidateCertificatePending={isValidateCertificatePendingById[id]}
            onViewClick={() => onCertificateViewClick(csr, 'CSR')}
            onDownloadClick={() => onCertificateDownloadClick(csr, dfspName, '.csr')}
            onViewSignedClick={() => onCertificateViewClick(certificate, 'Certificate')}
            onDownloadSignedClick={() => onCertificateDownloadClick(certificate, dfspName, '.cer')}
            onValidateSignedClick={() => onCertificateValidateClick(dfspId, id)}
          />
        )
      )}
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

const SentCSR = ({
  index,
  dfspName,
  certificate,
  certInfo,
  csr,
  csrInfo,
  state,
  validations,
  validationState,
  isValidateCertificatePending,
  onViewClick,
  onDownloadClick,
  onViewSignedClick,
  onDownloadSignedClick,
  onValidateSignedClick,
}) => (
  <CertificateCard.Box delay={index * 50}>
    <CertificateCard.Header>
      <CertificateCard.Details>
        <CertificateCard.PrimaryDetail>{dfspName}</CertificateCard.PrimaryDetail>
        <CertificateCard.SecondaryDetail>{csrInfo.subject.CN || 'CSR Common Name'}</CertificateCard.SecondaryDetail>
        <Status.CSR state={state} />
      </CertificateCard.Details>
      <CertificateCard.Controls>
        <CertificateCard.ControlButton
          icon="check-small"
          kind="success"
          label="Validate Certificate"
          noFill
          onClick={onValidateSignedClick}
          disabled={!certificate || state === STATES.VALID}
          pending={isValidateCertificatePending}
        />
      </CertificateCard.Controls>
    </CertificateCard.Header>
    <CertificateCard.Content>
      <div className="hub-sent-csrs__certificate-validation">
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
        onClick={onViewClick}
      />
      <CertificateCard.FooterButton icon="download-small" label="Download CSR" noFill onClick={onDownloadClick} />
      <CertificateCard.FooterButton
        icon="studio-project-small"
        label="View Certificate"
        kind="secondary"
        noFill
        onClick={onViewSignedClick}
        disabled={!certificate}
      />
      <CertificateCard.FooterButton
        icon="download-small"
        label="Download Certificate"
        noFill
        onClick={onDownloadSignedClick}
        disabled={!certificate}
      />
    </CertificateCard.Footer>
  </CertificateCard.Box>
);

const MountedSentCSRs = withMount(SentCSRsContainer, 'onMount');

export default connect(
  stateProps,
  actionProps
)(MountedSentCSRs);
