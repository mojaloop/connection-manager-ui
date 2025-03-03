import { handleActions } from 'redux-actions';
import {
  RESET_HUB_EXTERNAL_CA,
  SET_HUB_EXTERNAL_CA_ERROR,
  SET_HUB_EXTERNAL_CA_CERTIFICATE,
  SET_HUB_EXTERNAL_CA_ROOT_CERTIFICATE,
  SET_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN,
  SET_HUB_EXTERNAL_CA_NAME,
  RESET_HUB_EXTERNAL_CA_FORM,
  SHOW_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL,
  HIDE_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL,
  SHOW_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL,
  HIDE_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL,
} from './actions';

const initialState = {
  hubExternalCaError: undefined,
  hubExternalCertificates: undefined,
  hubExternalCaRootCert: undefined,
  hubExternalCaIntermediateChain: undefined,
  hubExternalCaName: undefined,
  isHubExternalCaRootCertificateModalVisible: false,
  hubExternalCaRootCertificateModalContent: undefined,
  isHubExternalCaIntermediateChainModalVisible: false,
  hubExternalCaIntermediateChainModalContent: undefined,
};

const HubExternalCa = handleActions(
  {
    [RESET_HUB_EXTERNAL_CA]: () => initialState,
    [SET_HUB_EXTERNAL_CA_ERROR]: (state, action) => ({
      ...state,
      hubExternalCaError: action.payload,
    }),
    [SET_HUB_EXTERNAL_CA_CERTIFICATE]: (state, action) => ({
      ...state,
      hubExternalCertificate: action.payload,
    }),
    [SET_HUB_EXTERNAL_CA_ROOT_CERTIFICATE]: (state, action) => ({
      ...state,
      hubExternalCaRootCert: action.payload,
    }),
    [SET_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN]: (state, action) => ({
      ...state,
      hubExternalCaIntermediateChain: action.payload,
    }),
    [SET_HUB_EXTERNAL_CA_NAME]: (state, action) => ({
      ...state,
      hubExternalCaName: action.payload,
    }),
    [RESET_HUB_EXTERNAL_CA_FORM]: (state) => ({
      ...state,
      hubExternalCaRootCert: undefined,
      hubExternalCaIntermediateChain: undefined,
      hubExternalCaName: undefined,
    }),
    [SHOW_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubExternalCaRootCertificateModalVisible: true,
      hubExternalCaRootCertificateModalContent: action.payload,
    }),
    [HIDE_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isHubExternalCaRootCertificateModalVisible: false,
      hubExternalCaRootCertificateModalContent: undefined,
    }),
    [SHOW_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isHubExternalCaIntermediateChainModalVisible: true,
      hubExternalCaIntermediateChainModalContent: action.payload,
    }),
    [HIDE_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL]: (state) => ({
      ...state,
      isHubExternalCaIntermediateChainModalVisible: false,
      hubExternalCaIntermediateChainModalContent: undefined,
    }),
  },
  initialState
);

export default HubExternalCa;
export { initialState };
