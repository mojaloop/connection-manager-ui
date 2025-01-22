import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfsps } from 'App/selectors';

export const RESET_HUB_SENT_CSRS = 'Hub Sent CSRs / Reset';
export const SET_HUB_SENT_CSRS_FILTER = 'Hub Sent CSRs / Set Filter';
export const SET_HUB_SENT_CSRS_ERROR = 'Hub Sent CSRs / Set Error';
export const SET_HUB_SENT_CSRS_CERTIFICATES = 'Hub Sent CSRs / Set Certificates';
export const SHOW_HUB_SENT_CSRS_CERTIFICATE_MODAL = 'Hub Sent CSRs / Show Certificate Modal';
export const HIDE_HUB_SENT_CSRS_CERTIFICATE_MODAL = 'Hub Sent CSRs / Hide Certificate Modal';

export const resetHubSentCsrs = createAction(RESET_HUB_SENT_CSRS);
export const setHubSentCsrsError = createAction(SET_HUB_SENT_CSRS_ERROR);
export const changeHubSentCsrsFilter = createAction(SET_HUB_SENT_CSRS_FILTER);
export const setHubSentCsrsCertificates = createAction(SET_HUB_SENT_CSRS_CERTIFICATES);
export const showHubSentCsrsCertificateModal = createAction(SHOW_HUB_SENT_CSRS_CERTIFICATE_MODAL);
export const hideHubSentCsrsCertificateModal = createAction(HIDE_HUB_SENT_CSRS_CERTIFICATE_MODAL);

export const storeHubSentCsrs = () => async (dispatch, getState) => {
  const dfsps = getDfsps(getState());
  const results = await Promise.all(dfsps.map(dfsp => dispatch(api.outboundEnrollments.read({ dfspId: dfsp.id }))));
  if (results.every(({ status }) => is200(status))) {
    const csrs = results.reduce(
      (prev, curr, index) => [
        ...prev,
        ...curr.data.map(csr => ({
          ...csr,
          dfspId: dfsps[index].id, // the dfsp ID could not be in the response
        })),
      ],
      []
    );

    dispatch(setHubSentCsrsCertificates(csrs));
  } else {
    dispatch(setHubSentCsrsError('Generic'));
  }
};

export const validateHubSentCsrCertificate = (dfspId, enrollmentId) => async (dispatch, getState) => {
  const { status } = await dispatch(api.outboundEnrollmentValidate.create({ dfspId, enrollmentId }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(storeHubSentCsrs());
  } else {
    dispatch(showErrorModal('Generic'));
  }
};

export const downloadHubSentCsrCertificate = (certificate, dfspName = undefined, extension) => (dispatch, getState) => {
  downloadFile(certificate, `${dfspName || ''}${extension}`);
};
