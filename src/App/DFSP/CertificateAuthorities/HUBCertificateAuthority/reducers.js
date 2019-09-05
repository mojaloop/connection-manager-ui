import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_HUB_CA,
  SET_DFSP_HUB_CA_ROOT_CERTIFICATE,
  SET_DFSP_HUB_CA_ERROR,
  SHOW_DFSP_HUB_CA_ROOT_CERTIFICATE_MODAL,
  HIDE_DFSP_HUB_CA_ROOT_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  dfspHubCaError: undefined,
  dfspHubCaRootCertificate: undefined,
  isDfspHubCaRootCertificateModalVisible: false,
};

const DfspHubCa = handleActions(
  {
    [RESET_DFSP_HUB_CA]: () => initialState,
    [SET_DFSP_HUB_CA_ERROR]: (state, action) => ({
      ...state,
      dfspHubCaError: action.payload,
    }),
    [SET_DFSP_HUB_CA_ROOT_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspHubCaRootCertificate: action.payload || null,
    }),
    [SHOW_DFSP_HUB_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubCaRootCertificateModalVisible: true,
    }),
    [HIDE_DFSP_HUB_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubCaRootCertificateModalVisible: false,
    }),
  },
  initialState
);

export default DfspHubCa;
export { initialState };
