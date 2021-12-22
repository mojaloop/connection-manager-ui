import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_HUB_EXTERNAL_CA,
  SET_DFSP_HUB_EXTERNAL_CA_ERROR,
  SET_DFSP_HUB_EXTERNAL_CA_CERTIFICATE,
  SHOW_DFSP_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL,
  HIDE_DFSP_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL,
  SHOW_DFSP_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL,
  HIDE_DFSP_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL,
} from './actions';

const initialState = {
  dfspHubExternalCaError: undefined,
  dfspHubExternalCertificates: [],
  dfspHubExternalCaRootCert: undefined,
  dfspHubExternalCaIntermediateChain: undefined,
  dfspHubExternalCaName: undefined,
  isDfspHubExternalCaRootCertificateModalVisible: false,
  dfspHubExternalCaRootCertificateModalContent: undefined,
  isDfspHubExternalCaIntermediateChainModalVisible: false,
  dfspHubExternalCaIntermediateChainModalContent: undefined,
};

const DfspHubExternalCa = handleActions(
  {
    [RESET_DFSP_HUB_EXTERNAL_CA]: () => initialState,
    [SET_DFSP_HUB_EXTERNAL_CA_ERROR]: (state, action) => ({
      ...state,
      dfspHubExternalCaError: action.payload,
    }),
    [SET_DFSP_HUB_EXTERNAL_CA_CERTIFICATE]: (state, action) => ({
      ...state,
      dfspHubExternalCertificates: action.payload,
    }),
    [SHOW_DFSP_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubExternalCaRootCertificateModalVisible: true,
      dfspHubExternalCaRootCertificateModalContent: action.payload,
    }),
    [HIDE_DFSP_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspHubExternalCaRootCertificateModalVisible: false,
      dfspHubExternalCaRootCertificateModalContent: undefined,
    }),
    [SHOW_DFSP_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspHubExternalCaIntermediateChainModalVisible: true,
      dfspHubExternalCaIntermediateChainModalContent: action.payload,
    }),
    [HIDE_DFSP_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspHubExternalCaIntermediateChainModalVisible: false,
      dfspHubExternalCaIntermediateChainModalContent: undefined,
    }),
  },
  initialState
);

export default DfspHubExternalCa;
export { initialState };
