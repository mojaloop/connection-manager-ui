import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { downloadFile } from 'utils/html';
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
  const { data, status } = await dispatch(api.inboundEnrollments.read({ dfspId }));

  if (is200(status)) {
    dispatch(setDfspHubCsrsCertificates(data));
  } else {
    dispatch(setDfspHubCsrsError('Generic'));
  }
};

export const submitCertificateDfspHubCsr = enrollmentId => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.inboundEnrollmentSign.create({ dfspId, enrollmentId }));

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
