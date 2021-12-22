import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { downloadFile, loadFile } from 'utils/html';
import { isCertificate } from 'utils/certificate';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfspId } from 'App/selectors';

export const RESET_DFSP_HUB_CSR = 'DFSP HUB CSRs / Reset';
export const SET_DFSP_HUB_CSR_ERROR = 'DFSP HUB CSRs / Set Root Cert Error';
export const SET_DFSP_HUB_CSR_CERTIFICATES = 'DFSP HUB CSRs / Set Certificates';
export const SHOW_DFSP_HUB_CSR_CERTIFICATE_MODAL = 'DFSP HUB CSRs / Show Certificate Modal';
export const HIDE_DFSP_HUB_CSR_CERTIFICATE_MODAL = 'DFSP HUB CSRs / Hide Certificate Modal';

export const resetDfspHubCsrs = createAction(RESET_DFSP_HUB_CSR);
export const setDfspHubCsrsError = createAction(SET_DFSP_HUB_CSR_ERROR);
export const setDfspHubCsrsCertificates = createAction(SET_DFSP_HUB_CSR_CERTIFICATES);
export const showDfspHubCsrsCertificateModal = createAction(SHOW_DFSP_HUB_CSR_CERTIFICATE_MODAL);
export const hideDfspHubCsrsCertificateModal = createAction(HIDE_DFSP_HUB_CSR_CERTIFICATE_MODAL);

export const storeDfspHubCsrs = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.outboundEnrollments.read({ dfspId }));

  if (is200(status)) {
    dispatch(setDfspHubCsrsCertificates(data));
  } else {
    dispatch(setDfspHubCsrsError('Generic'));
  }
};

export const submitCertificateDfspHubCsr = enrollmentId => async (dispatch, getState) => {
  let certificate = null;
  let invalid = true;
  try {
    certificate = await loadFile('.cer');
    invalid = !isCertificate(certificate);
  } catch (e) {
    invalid = true;
  }

  if (invalid) {
    dispatch(showErrorModal('The file selected is not a valid certificate'));
    return;
  }

  const dfspId = getDfspId(getState());
  const body = { certificate };
  const { data, status } = await dispatch(
    api.outboundEnrollmentCertificate.create({ dfspId, enrollmentId, body })
  );
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(storeDfspHubCsrs(data));
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadDfspSentCsrCertificate = (certificate, cn, extension) => (dispatch, getState) => {
  downloadFile(certificate, `${cn}${extension}`);
};
