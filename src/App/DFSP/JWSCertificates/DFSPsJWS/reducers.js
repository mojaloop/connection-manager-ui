import { handleActions } from 'redux-actions';
import {
  RESET_DFSPS_JWS,
  SET_DFSPS_JWS_ERROR,
  SET_DFSPS_JWS_FILTER,
  SET_DFSPS_JWS_CERTIFICATES,
  SHOW_DFSPS_JWS_JWS_CERTIFICATE_MODAL,
  HIDE_DFSPS_JWS_JWS_CERTIFICATE_MODAL,
  SHOW_DFSPS_JWS_INTERMEDIATE_CHAIN_MODAL,
  HIDE_DFSPS_JWS_INTERMEDIATE_CHAIN_MODAL,
} from './actions';

const initialState = {
  dfspsJWSError: undefined,
  dfspsJWSFilter: '',
  dfspsJWSCertificates: [],
  dfspsJWSJwsCertificateModalContent: undefined,
  isDfspsJWSJwsCertificateModalVisible: false,
  dfspsJWSIntermediateChainModalContent: undefined,
  isDfspsJWSIntermediateChainModalVisible: false,
};

const DfspsJWS = handleActions(
  {
    [RESET_DFSPS_JWS]: () => initialState,
    [SET_DFSPS_JWS_ERROR]: (state, action) => ({
      ...state,
      dfspsJWSError: action.payload,
    }),
    [SET_DFSPS_JWS_FILTER]: (state, action) => ({
      ...state,
      dfspsJWSFilter: action.payload || '',
    }),
    [SET_DFSPS_JWS_CERTIFICATES]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspsJWSCertificates:
        action.payload.map(({ intermediateChainInfo, ...certData }) => ({
          ...certData,
          intermediateChainInfo: intermediateChainInfo && intermediateChainInfo[0],
        })) || [],
    }),
    [SHOW_DFSPS_JWS_JWS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspsJWSJwsCertificateModalVisible: true,
      dfspsJWSJwsCertificateModalContent: action.payload,
    }),
    [HIDE_DFSPS_JWS_JWS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspsJWSJwsCertificateModalVisible: false,
      dfspsJWSJwsCertificateModalContent: undefined,
    }),
    [SHOW_DFSPS_JWS_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspsJWSIntermediateChainModalVisible: true,
      dfspsJWSIntermediateChainModalContent: action.payload,
    }),
    [HIDE_DFSPS_JWS_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isDfspsJWSIntermediateChainModalVisible: false,
      dfspsJWSIntermediateChainModalContent: undefined,
    }),
  },
  initialState
);

export default DfspsJWS;
export { initialState };
