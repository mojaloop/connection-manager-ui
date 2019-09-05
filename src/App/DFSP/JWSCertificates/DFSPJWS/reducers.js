import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_JWS,
  SET_DFSP_JWS_ERROR,
  SET_DFSP_JWS_JWS_CERTIFICATE,
  SET_DFSP_JWS_INTERMEDIATE_CHAIN,
  SET_DFSP_JWS_JWS_CERTIFICATE_INFO,
  SET_DFSP_JWS_INTERMEDIATE_CHAIN_INFO,
  SET_DFSP_JWS_VALIDATIONS,
  SET_DFSP_JWS_VALIDATION_STATE,
  CHANGE_DFSP_JWS_JWS_CERTIFICATE,
  CHANGE_DFSP_JWS_INTERMEDIATE_CHAIN,
  SHOW_DFSP_JWS_JWS_CERTIFICATE_MODAL,
  HIDE_DFSP_JWS_JWS_CERTIFICATE_MODAL,
  SHOW_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL,
  HIDE_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL,
} from './actions';

const initialState = {
  dfspJWSError: undefined,
  previousDfspJWSJwsCertificate: undefined,
  previousDfspJWSIntermediateChain: undefined,
  dfspJWSJwsCertificate: undefined,
  dfspJWSIntermediateChain: undefined,
  dfspJWSJwsCertificateInfo: undefined,
  dfspJWSIntermediateChainInfo: undefined,
  dfspJWSValidations: [],
  dfspJWSValidationState: undefined,
  isDfspJWSJwsCertificateModalVisible: false,
  isDfspJWSIntermediateChainModalVisible: false,
};

const DfspJWS = handleActions(
  {
    [RESET_DFSP_JWS]: () => initialState,
    [SET_DFSP_JWS_ERROR]: (state, action) => ({
      ...state,
      dfspJWSError: action.payload,
    }),
    [SET_DFSP_JWS_JWS_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      previousDfspJWSJwsCertificate: action.payload || null,
      dfspJWSJwsCertificate: action.payload || null,
    }),
    [SET_DFSP_JWS_INTERMEDIATE_CHAIN]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      previousDfspJWSIntermediateChain: action.payload || null,
      dfspJWSIntermediateChain: action.payload || null,
    }),
    [SET_DFSP_JWS_JWS_CERTIFICATE_INFO]: (state, action) => ({
      ...state,
      dfspJWSJwsCertificateInfo: action.payload,
    }),
    [SET_DFSP_JWS_INTERMEDIATE_CHAIN_INFO]: (state, action) => ({
      ...state,
      dfspJWSIntermediateChainInfo: action.payload,
    }),
    [SET_DFSP_JWS_VALIDATIONS]: (state, action) => ({
      ...state,
      dfspJWSValidations: action.payload,
    }),
    [SET_DFSP_JWS_VALIDATION_STATE]: (state, action) => ({
      ...state,
      dfspJWSValidationState: action.payload,
    }),
    [CHANGE_DFSP_JWS_JWS_CERTIFICATE]: (state, action) => ({
      ...state,
      dfspJWSJwsCertificate: action.payload || null,
      dfspJWSJwsCertificateInfo: initialState.dfspJWSJwsCertificateInfo,
      dfspJWSValidationState: initialState.dfspJWSValidationState,
      dfspJWSValidations: initialState.dfspJWSValidations,
    }),
    [CHANGE_DFSP_JWS_INTERMEDIATE_CHAIN]: (state, action) => ({
      ...state,
      dfspJWSIntermediateChain: action.payload || null,
      dfspJWSIntermediateChainInfo: initialState.dfspJWSIntermediateChainInfo,
      dfspJWSValidationState: initialState.dfspJWSValidationState,
      dfspJWSValidations: initialState.dfspJWSValidations,
    }),
    [SHOW_DFSP_JWS_JWS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspJWSJwsCertificateModalVisible: true,
    }),
    [HIDE_DFSP_JWS_JWS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspJWSJwsCertificateModalVisible: false,
    }),
    [SHOW_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspJWSIntermediateChainModalVisible: true,
    }),
    [HIDE_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspJWSIntermediateChainModalVisible: false,
    }),
  },
  initialState
);

export default DfspJWS;
export { initialState };
