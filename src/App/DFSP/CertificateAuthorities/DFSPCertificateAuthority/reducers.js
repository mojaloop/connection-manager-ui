import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_CA,
  SET_DFSP_CA_ERROR,
  SET_DFSP_CA_ROOT_CERTIFICATE,
  SET_DFSP_CA_INTERMEDIATE_CHAIN,
  SET_DFSP_CA_VALIDATIONS,
  SET_DFSP_CA_VALIDATION_STATE,
  CHANGE_DFSP_CA_ROOT_CERTIFICATE,
  CHANGE_DFSP_CA_INTERMEDIATE_CHAIN,
  SHOW_DFSP_CA_ROOT_CERTIFICATE_MODAL,
  HIDE_DFSP_CA_ROOT_CERTIFICATE_MODAL,
  SHOW_DFSP_CA_INTERMEDIATE_CHAIN_MODAL,
  HIDE_DFSP_CA_INTERMEDIATE_CHAIN_MODAL,
} from './actions';

const initialState = {
  dfspCaError: undefined,
  dfspCaRootCert: undefined,
  dfspCaIntermediateChain: undefined,
  dfspCaValidations: [],
  dfspCaValidationState: undefined,
  isDfspCaRootCertificateModalVisible: false,
  isDfspCaIntermediateChainModalVisible: false,
};

const DfspCa = handleActions(
  {
    [RESET_DFSP_CA]: () => initialState,
    [SET_DFSP_CA_ERROR]: (state, action) => ({
      ...state,
      dfspCaError: action.payload,
    }),
    [SET_DFSP_CA_ROOT_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspCaRootCert: action.payload || null,
    }),
    [SET_DFSP_CA_INTERMEDIATE_CHAIN]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspCaIntermediateChain: action.payload || null,
    }),
    [SET_DFSP_CA_VALIDATIONS]: (state, action) => ({
      ...state,
      dfspCaValidations: action.payload,
    }),
    [SET_DFSP_CA_VALIDATION_STATE]: (state, action) => ({
      ...state,
      dfspCaValidationState: action.payload,
    }),
    [CHANGE_DFSP_CA_ROOT_CERTIFICATE]: (state, action) => ({
      ...state,
      dfspCaRootCert: action.payload,
      dfspCaValidations: initialState.dfspCaValidations,
      dfspCaValidationState: initialState.dfspCaValidationState,
    }),
    [CHANGE_DFSP_CA_INTERMEDIATE_CHAIN]: (state, action) => ({
      ...state,
      dfspCaIntermediateChain: action.payload,
      dfspCaValidations: initialState.dfspCaValidations,
      dfspCaValidationState: initialState.dfspCaValidationState,
    }),
    [SHOW_DFSP_CA_ROOT_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isDfspCaRootCertificateModalVisible: true,
    }),
    [HIDE_DFSP_CA_ROOT_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isDfspCaRootCertificateModalVisible: false,
    }),
    [SHOW_DFSP_CA_INTERMEDIATE_CHAIN_MODAL]: (state) => ({
      ...state,
      isDfspCaIntermediateChainModalVisible: true,
    }),
    [HIDE_DFSP_CA_INTERMEDIATE_CHAIN_MODAL]: (state) => ({
      ...state,
      isDfspCaIntermediateChainModalVisible: false,
    }),
  },
  initialState
);

export default DfspCa;
export { initialState };
