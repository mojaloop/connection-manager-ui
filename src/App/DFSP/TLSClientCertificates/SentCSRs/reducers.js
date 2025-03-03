import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_SENT_CSRS,
  SET_DFSP_SENT_CSRS_ERROR,
  SET_DFSP_SENT_CSRS_FILTER,
  SET_DFSP_SENT_CSRS_CERTIFICATES,
  SHOW_DFSP_SENT_CSRS_CERTIFICATE_MODAL,
  HIDE_DFSP_SENT_CSRS_CERTIFICATE_MODAL,
} from './actions';

const initialState = {
  dfspSentCsrsError: undefined,
  dfspSentCsrsFilter: '',
  dfspSentCsrsCertificates: [],
  isDfspSentCsrsCertificateModalVisible: false,
  dfspSentCsrsCertificateModalContent: undefined,
  dfspSentCsrsCertificateModalTitle: undefined,
};

const DfspSentCsrs = handleActions(
  {
    [RESET_DFSP_SENT_CSRS]: () => initialState,
    [SET_DFSP_SENT_CSRS_ERROR]: (state, action) => ({
      ...state,
      dfspSentCsrsError: action.payload,
    }),
    [SET_DFSP_SENT_CSRS_FILTER]: (state, action) => ({
      ...state,
      dfspSentCsrsFilter: action.payload || '',
    }),
    [SET_DFSP_SENT_CSRS_CERTIFICATES]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      dfspSentCsrsCertificates: action.payload || [],
    }),
    [SHOW_DFSP_SENT_CSRS_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isDfspSentCsrsCertificateModalVisible: true,
      dfspSentCsrsCertificateModalContent: action.payload.certificate,
      dfspSentCsrsCertificateModalTitle: action.payload.title,
    }),
    [HIDE_DFSP_SENT_CSRS_CERTIFICATE_MODAL]: (state) => ({
      ...state,
      isDfspSentCsrsCertificateModalVisible: false,
      dfspSentCsrsCertificateModalContent: undefined,
      dfspSentCsrsCertificateModalTitle: undefined,
    }),
  },
  initialState
);

export default DfspSentCsrs;
export { initialState };
