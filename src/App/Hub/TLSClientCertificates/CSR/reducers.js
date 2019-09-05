import { handleActions } from 'redux-actions';
import {
  RESET_HUB_CSR,
  SET_HUB_CSR_DFSP_ID,
  SET_HUB_CSR_CERTIFICATE,
  SET_HUB_CSR_CSR_TYPE,
  SET_HUB_CSR_COMMON_NAME,
  SET_HUB_CSR_ORGANIZATION,
  SET_HUB_CSR_ORGANIZATION_UNIT,
  SET_HUB_CSR_EMAIL,
  SET_HUB_CSR_LOCALITY,
  SET_HUB_CSR_COUNTRY,
  SET_HUB_CSR_STATE,
  CHANGE_HUB_CSR_DNS,
  ADD_HUB_CSR_DNS,
  REMOVE_HUB_CSR_DNS,
  CHANGE_HUB_CSR_IP,
  ADD_HUB_CSR_IP,
  REMOVE_HUB_CSR_IP,
  SHOW_HUB_CSR_CERTIFICATE_MODAL,
  HIDE_HUB_CSR_CERTIFICATE_MODAL,
} from './actions';
import { CSR_TYPES } from './constants';

const dnsInitialState = undefined;
const ipInitialState = undefined;
const initialState = {
  hubCsrDfspId: undefined,
  hubCsrCertificate: undefined,
  hubCsrCsrType: CSR_TYPES.FILE,
  hubCsrCommonName: undefined,
  hubCsrOrganization: undefined,
  hubCsrOrganizationUnit: undefined,
  hubCsrEmail: undefined,
  hubCsrLocality: undefined,
  hubCsrCountry: undefined,
  hubCsrState: undefined,
  hubCsrDnss: [],
  hubCsrIps: [],
  isHubCsrModalVisible: false,
};

const HubCsr = handleActions(
  {
    [RESET_HUB_CSR]: () => initialState,
    [SET_HUB_CSR_DFSP_ID]: (state, action) => ({
      ...state,
      hubCsrDfspId: action.payload,
    }),
    [SET_HUB_CSR_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      hubCsrCertificate: action.payload || null,
    }),
    [SET_HUB_CSR_CSR_TYPE]: (state, action) => ({
      // reset the certificate when changing the CSR type
      ...state,
      hubCsrCsrType: action.payload,
      hubCsrCertificate: undefined,
    }),
    [SET_HUB_CSR_COMMON_NAME]: (state, action) => ({
      ...state,
      hubCsrCommonName: action.payload,
    }),
    [SET_HUB_CSR_ORGANIZATION]: (state, action) => ({
      ...state,
      hubCsrOrganization: action.payload,
    }),
    [SET_HUB_CSR_ORGANIZATION_UNIT]: (state, action) => ({
      ...state,
      hubCsrOrganizationUnit: action.payload,
    }),
    [SET_HUB_CSR_EMAIL]: (state, action) => ({
      ...state,
      hubCsrEmail: action.payload,
    }),
    [SET_HUB_CSR_LOCALITY]: (state, action) => ({
      ...state,
      hubCsrLocality: action.payload,
    }),
    [SET_HUB_CSR_COUNTRY]: (state, action) => ({
      ...state,
      hubCsrCountry: action.payload,
    }),
    [SET_HUB_CSR_STATE]: (state, action) => ({
      ...state,
      hubCsrState: action.payload,
    }),
    [CHANGE_HUB_CSR_DNS]: (state, action) => {
      const { index, value } = action.payload;
      return {
        ...state,
        hubCsrDnss: [...state.hubCsrDnss.slice(0, index), value, ...state.hubCsrDnss.slice(index + 1)],
      };
    },
    [ADD_HUB_CSR_DNS]: (state, action) => ({
      ...state,
      hubCsrDnss: [...state.hubCsrDnss, dnsInitialState],
    }),
    [REMOVE_HUB_CSR_DNS]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        hubCsrDnss: [...state.hubCsrDnss.slice(0, index), ...state.hubCsrDnss.slice(index + 1)],
      };
    },
    [CHANGE_HUB_CSR_IP]: (state, action) => {
      const { index, value } = action.payload;
      return {
        ...state,
        hubCsrIps: [...state.hubCsrIps.slice(0, index), value, ...state.hubCsrIps.slice(index + 1)],
      };
    },
    [ADD_HUB_CSR_IP]: (state, action) => ({
      ...state,
      hubCsrIps: [...state.hubCsrIps, ipInitialState],
    }),
    [REMOVE_HUB_CSR_IP]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        hubCsrIps: [...state.hubCsrIps.slice(0, index), ...state.hubCsrIps.slice(index + 1)],
      };
    },
    [SHOW_HUB_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubCsrModalVisible: true,
    }),
    [HIDE_HUB_CSR_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubCsrModalVisible: false,
    }),
  },
  initialState
);

export default HubCsr;
export { initialState };
