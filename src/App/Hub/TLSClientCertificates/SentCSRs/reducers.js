import { handleActions } from 'redux-actions';
import {
  RESET_HUB_SENT_CSRS,
  SET_HUB_SENT_CSRS_ERROR,
  SET_HUB_SENT_CSRS_FILTER,
  SET_HUB_SENT_CSRS_CERTIFICATES,
  SHOW_HUB_SENT_CSRS_CERTIFICATE_MODAL,
  HIDE_HUB_SENT_CSRS_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  hubSentCsrsError: undefined,
  hubSentCsrsFilter: '',
  hubSentCsrsCertificates: [],
  isHubSentCsrsCertificateModalVisible: false,
  hubSentCsrsCertificateModalContent: undefined,
  hubSentCsrsCertificateModalTitle: undefined,
};

const HubSentCsrs = handleActions(
  {
    [RESET_HUB_SENT_CSRS]: () => initialState,
    [SET_HUB_SENT_CSRS_ERROR]: (state, action) => ({
      ...state,
      hubSentCsrsError: action.payload,
    }),
    [SET_HUB_SENT_CSRS_FILTER]: (state, action) => ({
      ...state,
      hubSentCsrsFilter: action.payload || '',
    }),
    [SET_HUB_SENT_CSRS_CERTIFICATES]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      hubSentCsrsCertificates: action.payload || [],
    }),
    [SHOW_HUB_SENT_CSRS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubSentCsrsCertificateModalVisible: true,
      hubSentCsrsCertificateModalContent: action.payload.certificate,
      hubSentCsrsCertificateModalTitle: action.payload.title,
    }),
    [HIDE_HUB_SENT_CSRS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubSentCsrsCertificateModalVisible: false,
      hubSentCsrsCertificateModalContent: undefined,
      hubSentCsrsCertificateModalTitle: undefined,
    }),
  },
  initialState
);

export default HubSentCsrs;
export { initialState };
