import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_CSR,
  SET_DFSP_CSR_CERTIFICATE,
  SHOW_DFSP_CSR_CERTIFICATE_MODAL,
  HIDE_DFSP_CSR_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  dfspCsrCertificate: undefined,
  isDfspCsrModalVisible: false,
};

const DfspCsr = handleActions(
  {
    [RESET_DFSP_CSR]: () => initialState,
    [SET_DFSP_CSR_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspCsrCertificate: action.payload || null,
    }),
    [SHOW_DFSP_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspCsrModalVisible: true,
    }),
    [HIDE_DFSP_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspCsrModalVisible: false,
    }),
  },
  initialState
);

export default DfspCsr;
export { initialState };
