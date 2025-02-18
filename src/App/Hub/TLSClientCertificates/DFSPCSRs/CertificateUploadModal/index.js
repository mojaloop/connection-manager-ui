import React from 'react';
import { connect } from 'react-redux';
import { FormInput, Modal } from 'components';
import {
  hideHubDfspCsrsCertificateUploadModal,
  submitCertificateHubDfspCsr,
  setHubDfspsCsrsCertificateUploadModalCertificate,
  setHubDfspsCsrsCertificateUploadModalCaId,
} from '../actions';
import {
  getHubDfspCsrsCertificateUploadModalCas,
  getHubDfspCsrsCertificateUploadModalCertificate,
  getHubDfspCsrsCertificateUploadModalHubCaId,
  getHubDfspCsrsCertificateModalUploadValidationResult,
  getHubDfspCsrsIsCertificateUploadModalSubmitEnabled,
  getHubDfspCsrsIsCertificateUploadModalSubmitPending,
} from '../selectors';

import './index.css';

const stateProps = state => ({
  certificate: getHubDfspCsrsCertificateUploadModalCertificate(state),
  externalCas: getHubDfspCsrsCertificateUploadModalCas(state),
  hubCAId: getHubDfspCsrsCertificateUploadModalHubCaId(state),
  validation: getHubDfspCsrsCertificateModalUploadValidationResult(state),
  isSubmitEnabled: getHubDfspCsrsIsCertificateUploadModalSubmitEnabled(state),
  isSubmitPending: getHubDfspCsrsIsCertificateUploadModalSubmitPending(state),
});

const actionProps = dispatch => ({
  onSubmit: () => dispatch(submitCertificateHubDfspCsr()),
  onClose: () => dispatch(hideHubDfspCsrsCertificateUploadModal()),
  onCertificateChange: value => dispatch(setHubDfspsCsrsCertificateUploadModalCertificate(value)),
  onHubCaIdChange: value => dispatch(setHubDfspsCsrsCertificateUploadModalCaId(value)),
});

const CertificateUploadModal = ({
  externalCas,
  certificate,
  hubCAId,
  validation,
  isSubmitEnabled,
  isSubmitPending,
  onCertificateChange,
  onHubCaIdChange,
  onSubmit,
  onClose,
}) => (
  <Modal
    title="Upload certificate"
    primaryAction="Save"
    width="800px"
    allowSubmit
    isSubmitEnabled={isSubmitEnabled}
    isSubmitPending={isSubmitPending}
    onSubmit={onSubmit}
    onClose={onClose}
  >
    <div>
      <div className="hub__hub-dfsp-csrs__upload-modal__certificate">
        <FormInput
          type="file"
          label="Certificate"
          parseFileAsText
          onChange={onCertificateChange}
          value={certificate || null}
          validation={validation.fields.certificate}
        />
      </div>
      <div className="hub__hub-dfsp-csrs__upload-modal__ca-id">
        <FormInput
          type="select"
          label="External CA"
          parseFileAsText
          onChange={onHubCaIdChange}
          options={externalCas}
          value={hubCAId || null}
          validation={validation.fields.hubCAId}
        />
      </div>
    </div>
  </Modal>
);

export default connect(stateProps, actionProps)(CertificateUploadModal);
