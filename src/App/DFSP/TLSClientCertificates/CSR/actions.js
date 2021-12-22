import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfspId } from 'App/selectors';
import { getDfspCsrCertificate } from './selectors';

export const RESET_DFSP_CSR = 'DFSP CSR / Reset';
export const SET_DFSP_CSR_CERTIFICATE = 'DFSP CSR / Set Certificate';
export const SHOW_DFSP_CSR_CERTIFICATE_MODAL = 'DFSP CSR / Show Certificate Modal';
export const HIDE_DFSP_CSR_CERTIFICATE_MODAL = 'DFSP CSR / Hide Certificate Modal';

export const resetDfspCsr = createAction(RESET_DFSP_CSR);
export const setDfspCsrCertificate = createAction(SET_DFSP_CSR_CERTIFICATE);
export const showDfspCsrModal = createAction(SHOW_DFSP_CSR_CERTIFICATE_MODAL);
export const hideDfspCsrModal = createAction(HIDE_DFSP_CSR_CERTIFICATE_MODAL);

export const submitDfspCsr = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const clientCSR = getDfspCsrCertificate(getState());
  const body = { clientCSR };

  const { data, status } = await dispatch(api.inboundEnrollments.create({ dfspId, body }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(resetDfspCsr());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};
