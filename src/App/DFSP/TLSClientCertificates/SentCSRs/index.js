import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateCard,
  CertificateModal,
  CertificateInfo,
  CertificateValidation,
  MessageBox,
  Status,
  Spinner,
  TextField,
} from 'components';
import { withMount } from 'utils/hocs';
import { getDfspName } from 'App/selectors';
import {
  storeDfspSentCsrs,
  setDfspSentCsrsFilter,
  downloadDfspSentCsrCertificate,
  showDfspSentCsrsCertificateModal,
  hideDfspSentCsrsCertificateModal,
} from './actions';
import {
  getDfspSentCsrsError,
  getDfspSentCsrsFilter,
  getFilteredDfspSentCsrsCertificates,
  getDfspSentCsrsCertificateModalContent,
  getDfspSentCsrsCertificateModalTitle,
  getIsDfspSentCsrsCertificateModalVisible,
  getIsDfspSentCsrsPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  dfspName: getDfspName(state),
  error: getDfspSentCsrsError(state),
  csrs: getFilteredDfspSentCsrsCertificates(state),
  filter: getDfspSentCsrsFilter(state),
  certificateModalContent: getDfspSentCsrsCertificateModalContent(state),
  certificateModalTitle: getDfspSentCsrsCertificateModalTitle(state),
  isCertificateModalVisible: getIsDfspSentCsrsCertificateModalVisible(state),
  isDfspSentCsrsPending: getIsDfspSentCsrsPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspSentCsrs()),
  onFilterChange: value => dispatch(setDfspSentCsrsFilter(value)),
  onCertificateViewClick: (certificate, title) => dispatch(showDfspSentCsrsCertificateModal({ certificate, title })),
  onCertificateDownloadClick: (certificate, extension) =>
    dispatch(downloadDfspSentCsrCertificate(certificate, extension)),
  onCertificateModalCloseClick: () => dispatch(hideDfspSentCsrsCertificateModal()),
});

const SentCSRs = ({
  error,
  csrs,
  filter,
  isCertificateModalVisible,
  certificateModalContent,
  certificateModalTitle,
  isDfspSentCsrsPending,
  onFilterChange,
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
  }
  return (
    <div className="dfsp-sent-csrs">
      <div className="dfsp-sent-csrs__filter">
        <TextField placeholder="Search DFSP CSRs" value={filter} onChange={onFilterChange} />
      </div>

      <FilteredSentCSRS
        isPending={isDfspSentCsrsPending}
        csrs={csrs}
        onCertificateViewClick={onCertificateViewClick}
        onCertificateDownloadClick={onCertificateDownloadClick}
      />

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

const FilteredSentCSRS = ({ isPending, csrs, onCertificateViewClick, onCertificateDownloadClick }) => {
  if (!csrs.length) {
    return (
      <MessageBox icon="info-small" kind="default" message="There are no sent CSRs" size={30} fontSize={17} center />
    );
  } else if (isPending) {
    return <Spinner center size={20} />;
  }
  return csrs.map(({ certificate, csr, csrInfo, certInfo, state, validations, validationState, externalCa }, index) => (
    <SentCSR
      key={index}
      index={index}
      certificate={certificate}
      csr={csr}
      csrInfo={csrInfo}
      certInfo={certInfo}
      state={state}
      validations={validations}
      validationState={validationState}
      externalCa={externalCa}
      onViewClick={() => onCertificateViewClick(csr, 'CSR')}
      onDownloadClick={() => onCertificateDownloadClick(csr, '.csr')}
      onViewSignedClick={() => onCertificateViewClick(certificate, 'Certificate')}
      onDownloadSignedClick={() => onCertificateDownloadClick(certificate, '.cer')}
    />
  ));
};

const SentCSR = ({
  index,
  certificate,
  csr,
  csrInfo,
  certInfo,
  state,
  validations,
  validationState,
  externalCa,
  onViewClick,
  onDownloadClick,
  onViewSignedClick,
  onDownloadSignedClick,
}) => (
  <CertificateCard.Box delay={index * 50}>
    <CertificateCard.Header>
      <CertificateCard.Details>
        <CertificateCard.PrimaryDetail>{csrInfo.subject.CN || 'Common Name'}</CertificateCard.PrimaryDetail>
        <Status.CSR state={state} />
      </CertificateCard.Details>
    </CertificateCard.Header>

    <CertificateCard.Content>
      <div className="dfsp-sent-csrs__certificate-validation">
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
      {externalCa && (
        <MessageBox icon="info-small" size={16} fontSize={12} className="dfsp-sent-csrs__external-ca__message-box">
          <span>
            Signed with external CA <i>{externalCa.name}</i>
          </span>
        </MessageBox>
      )}
    </CertificateCard.Footer>
  </CertificateCard.Box>
);

const MountedSentCSRs = withMount(SentCSRs, 'onMount');

export default connect(
  stateProps,
  actionProps
)(MountedSentCSRs);
