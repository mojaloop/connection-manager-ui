import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_SC,
  SET_DFSP_SC_ERROR,
  SET_DFSP_SC_ROOT_CERTIFICATE,
  SET_DFSP_SC_INTERMEDIATE_CHAIN,
  SET_DFSP_SC_SERVER_CERTIFICATE,
  SET_DFSP_SC_ROOT_CERTIFICATE_INFO,
  SET_DFSP_SC_INTERMEDIATE_CHAIN_INFO,
  SET_DFSP_SC_SERVER_CERTIFICATE_INFO,
  SET_DFSP_SC_VALIDATIONS,
  SET_DFSP_SC_VALIDATION_STATE,
  CHANGE_DFSP_SC_ROOT_CERTIFICATE,
  CHANGE_DFSP_SC_INTERMEDIATE_CHAIN,
  CHANGE_DFSP_SC_SERVER_CERTIFICATE,
  SHOW_DFSP_SC_ROOT_CERTIFICATE_MODAL,
  HIDE_DFSP_SC_ROOT_CERTIFICATE_MODAL,
  SHOW_DFSP_SC_INTERMEDIATE_CHAIN_MODAL,
  HIDE_DFSP_SC_INTERMEDIATE_CHAIN_MODAL,
  SHOW_DFSP_SC_SERVER_CERTIFICATE_MODAL,
  HIDE_DFSP_SC_SERVER_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  dfspSCError: undefined,
  previousDfspSCRootCertificate: undefined,
  previousDfspSCIntermediateChain: undefined,
  previousDfspSCServerCertificate: undefined,
  dfspSCRootCertificate: undefined,
  dfspSCIntermediateChain: undefined,
  dfspSCServerCertificate: undefined,
  dfspSCRootCertificateInfo: undefined,
  dfspSCIntermediateChainInfo: undefined,
  dfspSCServerCertificateInfo: undefined,
  dfspSCValidations: [],
  dfspSCValidationState: undefined,
  isDfspSCRootCertificateModalVisible: false,
  isDfspSCIntermediateChainModalVisible: false,
  isDfspSCServerCertificateModalVisible: false,
};

const DfspSC = handleActions(
  {
    [RESET_DFSP_SC]: () => initialState,
    [SET_DFSP_SC_ERROR]: (state, action) => ({
      ...state,
      dfspSCError: action.payload,
    }),
    [SET_DFSP_SC_ROOT_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      previousDfspSCRootCertificate: action.payload || null,
      dfspSCRootCertificate: action.payload || null,
    }),
    [SET_DFSP_SC_INTERMEDIATE_CHAIN]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      previousDfspSCIntermediateChain: action.payload || null,
      dfspSCIntermediateChain: action.payload || null,
    }),
    [SET_DFSP_SC_SERVER_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      previousDfspSCServerCertificate: action.payload || null,
      dfspSCServerCertificate: action.payload || null,
    }),
    [SET_DFSP_SC_ROOT_CERTIFICATE_INFO]: (state, action) => ({
      ...state,
      dfspSCRootCertificateInfo: action.payload,
    }),
    [SET_DFSP_SC_INTERMEDIATE_CHAIN_INFO]: (state, action) => ({
      ...state,
      dfspSCIntermediateChainInfo: action.payload,
    }),
    [SET_DFSP_SC_SERVER_CERTIFICATE_INFO]: (state, action) => ({
      ...state,
      dfspSCServerCertificateInfo: action.payload,
    }),
    [SET_DFSP_SC_VALIDATIONS]: (state, action) => ({
      ...state,
      dfspSCValidations: action.payload,
    }),
    [SET_DFSP_SC_VALIDATION_STATE]: (state, action) => ({
      ...state,
      dfspSCValidationState: action.payload,
    }),
    [CHANGE_DFSP_SC_ROOT_CERTIFICATE]: (state, action) => ({
      ...state,
      dfspSCRootCertificate: action.payload || null,
      dfspSCRootCertificateInfo: initialState.dfspSCRootCertificateInfo,
      dfspSCValidationState: initialState.dfspSCValidationState,
      dfspSCValidations: initialState.dfspSCValidations,
    }),
    [CHANGE_DFSP_SC_INTERMEDIATE_CHAIN]: (state, action) => ({
      ...state,
      dfspSCIntermediateChain: action.payload || null,
      dfspSCIntermediateChainInfo: initialState.dfspSCIntermediateChainInfo,
      dfspSCValidationState: initialState.dfspSCValidationState,
      dfspSCValidations: initialState.dfspSCValidations,
    }),
    [CHANGE_DFSP_SC_SERVER_CERTIFICATE]: (state, action) => ({
      ...state,
      dfspSCServerCertificate: action.payload || null,
      dfspSCServerCertificateInfo: initialState.dfspSCServerCertificateInfo,
      dfspSCValidationState: initialState.dfspSCValidationState,
      dfspSCValidations: initialState.dfspSCValidations,
    }),
    [SHOW_DFSP_SC_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspSCRootCertificateModalVisible: true,
    }),
    [HIDE_DFSP_SC_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspSCRootCertificateModalVisible: false,
    }),
    [SHOW_DFSP_SC_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspSCIntermediateChainModalVisible: true,
    }),
    [HIDE_DFSP_SC_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspSCIntermediateChainModalVisible: false,
    }),
    [SHOW_DFSP_SC_SERVER_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspSCServerCertificateModalVisible: true,
    }),
    [HIDE_DFSP_SC_SERVER_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspSCServerCertificateModalVisible: false,
    }),
  },
  initialState
);

export default DfspSC;
export { initialState };
