import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfsps } from 'App/selectors';
import {
  getHubDfspCsrsCertificateModalUploadModel,
  getHubDfspCsrsCertificateUploadModalDfspId,
  getHubDfspCsrsCertificateUploadModalEnrollmentId,
} from './selectors';

export const RESET_HUB_DFSP_CSR = 'HUB DFSP CSRs / Reset';
export const SET_HUB_DFSP_CSR_FILTER = 'HUB DFSP CSRs / Set Filter';
export const SET_HUB_DFSP_CSR_ERROR = 'HUB DFSP CSRs / Set Error';
export const SET_HUB_DFSP_CSR_CERTIFICATES = 'HUB DFSP CSRs / Set Certificates';
export const SHOW_HUB_DFSP_CSR_CERTIFICATE_MODAL = 'HUB DFSP CSRs / Show Certificate Modal';
export const HIDE_HUB_DFSP_CSR_CERTIFICATE_MODAL = 'HUB DFSP CSRs / Hide Certificate Modal';
export const SHOW_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL = 'HUB DFSP CSRs / Show Certificate Upload Modal';
export const HIDE_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL = 'HUB DFSP CSRs / Hide Certificate Upload Modal';
export const SET_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL_CERTIFICATE =
  'HUB DFSP CSRs / Set Certificate Upload Modal Certificate';
export const SET_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL_CA_ID = 'HUB DFSP CSRs / Set Certificate Upload Modal Ca Id';

export const resetHubDfspCsrs = createAction(RESET_HUB_DFSP_CSR);
export const setHubDfspCsrsFilter = createAction(SET_HUB_DFSP_CSR_FILTER);
export const setHubDfspCsrsError = createAction(SET_HUB_DFSP_CSR_ERROR);
export const setHubDfspCsrsCertificates = createAction(SET_HUB_DFSP_CSR_CERTIFICATES);
export const showHubDfspCsrsCertificateModal = createAction(SHOW_HUB_DFSP_CSR_CERTIFICATE_MODAL);
export const hideHubDfspCsrsCertificateModal = createAction(HIDE_HUB_DFSP_CSR_CERTIFICATE_MODAL);
export const showHubDfspCsrsCertificateUploadModal = createAction(SHOW_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL);
export const hideHubDfspCsrsCertificateUploadModal = createAction(HIDE_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL);
export const setHubDfspsCsrsCertificateUploadModalCertificate = createAction(
  SET_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL_CERTIFICATE
);
export const setHubDfspsCsrsCertificateUploadModalCaId = createAction(SET_HUB_DFSP_CSR_CERTIFICATE_UPLOAD_MODAL_CA_ID);

export const storeHubDfspCsrs = () => async (dispatch, getState) => {
  const dfsps = getDfsps(getState());
  const results = await Promise.all(
    dfsps.map(dfsp => dispatch(api.inboundEnrollments.read({ dfspId: dfsp.id })))
  );

  if (results.every(({ status }) => is200(status) || is404(status))) {
    const certificates = results.reduce(
      (prev, curr, index) => [
        ...prev,
        ...curr.data.map(certificate => ({
          dfspId: dfsps[index].id, // the dfsp ID could not be in the response
          error: !is200(curr.status) && !is404(curr.status),
          ...certificate,
        })),
      ],
      []
    );

    dispatch(setHubDfspCsrsCertificates(certificates));
  } else {
    dispatch(setHubDfspCsrsError('Generic'));
  }
};

export const submitCASignHubDfspCsr = (dfspId, enrollmentId) => async (dispatch, getState) => {
  const { data, status } = await dispatch(api.inboundEnrollmentSign.create({ dfspId, enrollmentId }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(storeHubDfspCsrs());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const submitCertificateHubDfspCsr = () => async (dispatch, getState) => {
  const model = getHubDfspCsrsCertificateModalUploadModel(getState());
  const dfspId = getHubDfspCsrsCertificateUploadModalDfspId(getState());
  const enrollmentId = getHubDfspCsrsCertificateUploadModalEnrollmentId(getState());
  const { data, status } = await dispatch(
    api.inboundEnrollmentCertificate.create({ dfspId, enrollmentId, body: model })
  );
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(storeHubDfspCsrs(data));
    dispatch(hideHubDfspCsrsCertificateUploadModal());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadHubDfspCsrCertificate = (certificate, dfspName, cn, extension) => (dispatch, getState) => {
  downloadFile(certificate, `${dfspName}-${cn}-${extension}`);
};
