import { handleActions } from 'redux-actions';
import {
  RESET_HUB_DFSP_SC,
  SET_HUB_DFSP_SC_CERTIFICATES,
  SET_HUB_DFSP_SC_ERROR,
  SHOW_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL,
  HIDE_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL,
  SHOW_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL,
  HIDE_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL,
  SHOW_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL,
  HIDE_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  hubDfspSCError: undefined,
  hubDfspSCCertificates: [],
  hubDfspSCRootCertificateModalContent: undefined,
  isHubDfspSCRootCertificateModalVisible: false,
  hubDfspSCIntermediateChainModalContent: undefined,
  isHubDfspSCIntermediateChainModalVisible: false,
  hubDfspSCServerCertificateModalContent: undefined,
  isHubDfspSCServerCertificateModalVisible: false,
};

const HubDfspSC = handleActions(
  {
    [RESET_HUB_DFSP_SC]: () => initialState,
    [SET_HUB_DFSP_SC_ERROR]: (state, action) => ({
      ...state,
      hubDfspSCError: action.payload,
    }),
    [SET_HUB_DFSP_SC_CERTIFICATES]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      hubDfspSCCertificates:
        action.payload.map(({ intermediateChainInfo, ...certData }) => ({
          ...certData,
          intermediateChainInfo: intermediateChainInfo && intermediateChainInfo[0],
        })) || [],
    }),
    [SHOW_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubDfspSCRootCertificateModalVisible: true,
      hubDfspSCRootCertificateModalContent: action.payload,
    }),
    [HIDE_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isHubDfspSCRootCertificateModalVisible: false,
      hubDfspSCRootCertificateModalContent: undefined,
    }),
    [SHOW_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL]: (state, action) => ({
      ...state,
      isHubDfspSCIntermediateChainModalVisible: true,
      hubDfspSCIntermediateChainModalContent: action.payload,
    }),
    [HIDE_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL]: (state) => ({
      ...state,
      isHubDfspSCIntermediateChainModalVisible: false,
      hubDfspSCIntermediateChainModalContent: undefined,
    }),
    [SHOW_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubDfspSCServerCertificateModalVisible: true,
      hubDfspSCServerCertificateModalContent: action.payload,
    }),
    [HIDE_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isHubDfspSCServerCertificateModalVisible: false,
      hubDfspSCServerCertificateModalContent: undefined,
    }),
  },
  initialState
);

export default HubDfspSC;
export { initialState };
