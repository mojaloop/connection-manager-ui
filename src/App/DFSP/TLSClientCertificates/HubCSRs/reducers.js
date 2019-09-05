import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_HUB_CSR,
  SET_DFSP_HUB_CSR_CERTIFICATES,
  SET_DFSP_HUB_CSR_ERROR,
  SHOW_DFSP_HUB_CSR_CERTIFICATE_MODAL,
  HIDE_DFSP_HUB_CSR_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  dfspHubCsrsError: undefined,
  dfspHubCsrsCertificates: [],
  isDfspHubCsrsCertificateModalVisible: false,
  dfspHubCsrsCertificateModalContent: undefined,
  dfspHubCsrsCertificateModalTitle: undefined,
};

const DfspHubCsrs = handleActions(
  {
    [RESET_DFSP_HUB_CSR]: () => initialState,
    [SET_DFSP_HUB_CSR_ERROR]: (state, action) => ({
      ...state,
      dfspHubCsrsError: action.payload,
    }),
    [SET_DFSP_HUB_CSR_CERTIFICATES]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspHubCsrsCertificates: action.payload || [],
    }),
    [SHOW_DFSP_HUB_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubCsrsCertificateModalVisible: true,
      dfspHubCsrsCertificateModalContent: action.payload.certificate,
      dfspHubCsrsCertificateModalTitle: action.payload.title,
    }),
    [HIDE_DFSP_HUB_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubCsrsCertificateModalVisible: false,
      dfspHubCsrsCertificateModalContent: undefined,
      dfspHubCsrsCertificateModalTitle: undefined,
    }),
  },
  initialState
);

export default DfspHubCsrs;
export { initialState };
