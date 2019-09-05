import React from 'react';
import { connect } from 'react-redux';
import {
  CertificateCard,
  CertificateInfo,
  CertificateModal,
  CertificateValidation,
  MessageBox,
  PendingOverlay,
  TextField,
  Status,
} from 'components';
import { withMount } from 'utils/hocs';
import { isNil, isNotNil } from 'utils/testers';
import CertificateUploadModal from './CertificateUploadModal';

import {
  storeHubDfspCsrs,
  setHubDfspCsrsFilter,
  submitCASignHubDfspCsr,
  showHubDfspCsrsCertificateUploadModal,
  downloadHubDfspCsrCertificate,
  showHubDfspCsrsCertificateModal,
  hideHubDfspCsrsCertificateModal,
} from './actions';
import {
  getHubDfspCsrsError,
  getHubDfspCsrsFilter,
  getFilteredHubDfspCsrsCertificatesByDFSP,
  getHubDfspCsrsCertificateModalContent,
  getHubDfspCsrsCertificateModalTitle,
  getIsHubDfspCsrsCertificateUploadModalVisible,
  getIsHubDfspCsrsCertificateModalVisible,
  getIsHubDfspCsrsPending,
  getIsHubDfspCASigningPendingByEnrollmentId,
  getIsHubDfspCertificateSigningPending,
} from './selectors';

import { getIsHubCaMissing } from 'App/Hub/CertificateAuthorities/HUBCertificateAuthority/selectors';
import { getIsHubExternalCasMissing } from 'App/Hub/CertificateAuthorities/HUBExternalCertificateAuthority/selectors';

import { VALIDATION_STATES } from 'App/Hub/constants';

import './index.css';

const stateProps = state => ({
  error: getHubDfspCsrsError(state),
  filter: getHubDfspCsrsFilter(state),
  csrs: getFilteredHubDfspCsrsCertificatesByDFSP(state),
  isCertificateModalVisible: getIsHubDfspCsrsCertificateModalVisible(state),
  certificateModalContent: getHubDfspCsrsCertificateModalContent(state),
  certificateModalTitle: getHubDfspCsrsCertificateModalTitle(state),

  isCertificateUploadModalVisible: getIsHubDfspCsrsCertificateUploadModalVisible(state),
  isHubCaMissing: getIsHubCaMissing(state),
  isHubExternalCasMissing: getIsHubExternalCasMissing(state),
  isHubDfspCsrsPending: getIsHubDfspCsrsPending(state),
  isCASigningPendingByEnrollmentId: getIsHubDfspCASigningPendingByEnrollmentId(state),
  isCertificateSigningPending: getIsHubDfspCertificateSigningPending(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeHubDfspCsrs()),
  onFilterChange: value => dispatch(setHubDfspCsrsFilter(value)),
  onCASignDfspCsrClick: (dfspId, enrollmentId) => dispatch(submitCASignHubDfspCsr(dfspId, enrollmentId)),
  onCertificateSignDfspCsrClick: (dfspId, enrollmentId) =>
    dispatch(showHubDfspCsrsCertificateUploadModal({ dfspId, enrollmentId })),
  onCertificateViewClick: (certificate, title) => dispatch(showHubDfspCsrsCertificateModal({ certificate, title })),
  onCertificateDownloadClick: (certificate, dfspName, cn, extension) =>
    dispatch(downloadHubDfspCsrCertificate(certificate, dfspName, cn, extension)),
  onCertificateModalCloseClick: () => dispatch(hideHubDfspCsrsCertificateModal()),
});

const DFSPCSRsContainer = ({
  error,
  filter,
  csrs,
  isCertificateModalVisible,
  certificateModalContent,
  certificateModalTitle,
  isHubCaMissing,
  isHubExternalCasMissing,
  isHubDfspCsrsPending,
  isCASigningPendingByEnrollmentId,
  isCertificateSigningPending,

  certificateUploadModalCas,
  certificateUploadModalcertificate,
  certificateUploadModalCaId,
  certificateUploadModalValidation,
  isCertificateUploadModalVisible,
  isCertificateUploadModalSubmitEnabled,
  isCertificateUploadModalSubmitPending,

  onFilterChange,
  onCASignDfspCsrClick,
  onCertificateSignDfspCsrClick,
  onCertificateViewClick,
  onCertificateDownloadClick,
  onCertificateModalCloseClick,

  onCertificateModalUploadSubmitClick,
  onCertificateModalUploadCloseClick,
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
    <div className="hub-dfsp-csrs">
      {isHubDfspCsrsPending && <PendingOverlay />}

      <div className="hub-sent-csrs__filter">
        <TextField placeholder="Search DFSP CSRs" value={filter} onChange={onFilterChange} />
      </div>

      <DFSPCSRs
        csrs={csrs}
        isCertificateModalVisible={isCertificateModalVisible}
        certificateModalContent={certificateModalContent}
        isHubCaMissing={isHubCaMissing}
        isHubExternalCasMissing={isHubExternalCasMissing}
        isCASigningPendingByEnrollmentId={isCASigningPendingByEnrollmentId}
        isCertificateSigningPending={isCertificateSigningPending}
        onCASignDfspCsrClick={onCASignDfspCsrClick}
        onCertificateSignDfspCsrClick={onCertificateSignDfspCsrClick}
        onCertificateViewClick={onCertificateViewClick}
        onCertificateDownloadClick={onCertificateDownloadClick}
        onCertificateModalCloseClick={onCertificateModalCloseClick}
      />

      {isCertificateUploadModalVisible && <CertificateUploadModal />}
    </div>
  );
};

const DFSPCSRs = ({
  csrs,
  isCertificateModalVisible,
  certificateModalContent,
  certificateModalTitle,
  isHubCaMissing,
  isHubExternalCasMissing,
  isCASigningPending,
  isCASigningPendingByEnrollmentId,
  isCertificateSigningPending,
  onCASignDfspCsrClick,
  onCertificateSignDfspCsrClick,
  onCertificateViewClick,
  onCertificateDownloadClick,
  onCertificateModalCloseClick,
}) => {
  if (!csrs.length) {
    return (
      <MessageBox
        icon="info-small"
        kind="default"
        message="There are no unprocessed DFSP CSRs"
        size={30}
        fontSize={17}
        center
      />
    );
  }
  return (
    <div>
      {csrs.map(
        (
          {
            id,
            dfspId,
            dfspName,
            certificate,
            certInfo,
            csr,
            csrInfo,
            state,
            externalCa,
            validations,
            validationState,
          },
          index
        ) => (
          <DFSPCSR
            key={index}
            index={index}
            dfspName={dfspName}
            certificate={certificate}
            certInfo={certInfo}
            csr={csr}
            csrInfo={csrInfo}
            state={state}
            externalCa={externalCa}
            validations={validations}
            validationState={validationState}
            isHubCaMissing={isHubCaMissing}
            isHubExternalCasMissing={isHubExternalCasMissing}
            isCASigningPending={isCASigningPendingByEnrollmentId[id]}
            isCertificateSigningPending={isCertificateSigningPending}
            onCASignClick={() => onCASignDfspCsrClick(dfspId, id)}
            onCertificateSignClick={() => onCertificateSignDfspCsrClick(dfspId, id)}
            onViewClick={onCertificateViewClick}
            onDownloadClick={onCertificateDownloadClick}
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
const DFSPCSR = ({
  index,
  dfspName,
  certificate,
  certInfo,
  csr,
  csrInfo,
  state,
  externalCa,
  validations,
  validationState,
  isHubCaMissing,
  isHubExternalCasMissing,
  isCASigningPending,
  isCertificateSigningPending,
  onCASignClick,
  onCertificateSignClick,
  onViewClick,
  onDownloadClick,
}) => {
  const hasCertificate = !isNil(certificate);
  return (
    <CertificateCard.Box delay={index * 50}>
      <CertificateCard.Header>
        <CertificateCard.Details>
          <CertificateCard.PrimaryDetail>{dfspName}</CertificateCard.PrimaryDetail>
          <CertificateCard.SecondaryDetail>{csrInfo.subject.CN || 'CSR Common Name'}</CertificateCard.SecondaryDetail>
          <Status.CSR state={state} />
        </CertificateCard.Details>
        <CertificateCard.Controls>
          <CertificateCard.ControlButton
            label="Upload Certificate"
            icon="upload-small"
            disabled={
              isNotNil(certificate) ||
              isCertificateSigningPending ||
              isCASigningPending ||
              isHubExternalCasMissing ||
              validationState === VALIDATION_STATES.INVALID
            }
            onClick={onCertificateSignClick}
            pending={isCertificateSigningPending}
          />
          <CertificateCard.ControlButton
            label="Use Provided CA To Sign CSR"
            icon="edit-small"
            disabled={
              isNotNil(certificate) ||
              isCASigningPending ||
              isCertificateSigningPending ||
              isHubCaMissing ||
              validationState === VALIDATION_STATES.INVALID
            }
            onClick={onCASignClick}
            pending={isCASigningPending}
          />
        </CertificateCard.Controls>
      </CertificateCard.Header>

      <CertificateCard.Content>
        <div className="hub-dfsp-csrs__certificate-validation">
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
          onClick={() => onDownloadClick(csr, dfspName, csrInfo.subject.CN, '.csr')}
        />
        <CertificateCard.FooterButton
          icon="studio-project-small"
          label="View Certificate"
          kind="secondary"
          noFill
          onClick={() => onViewClick(certificate, 'Certificate')}
          disabled={!hasCertificate}
        />
        <CertificateCard.FooterButton
          icon="download-small"
          label="Download Certificate"
          noFill
          onClick={() => onDownloadClick(certificate, dfspName, certInfo.subject.CN, '.cer')}
          disabled={!hasCertificate}
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
};

const MountedDFSPsCSRS = withMount(DFSPCSRsContainer, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedDFSPsCSRS);
