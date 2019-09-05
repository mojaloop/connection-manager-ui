import { handleActions } from 'redux-actions';
import {
  RESET_HUB_CA,
  SET_HUB_CA_ERROR,
  SET_HUB_CA_COMMON_NAME,
  SET_HUB_CA_ORGANIZATION,
  SET_HUB_CA_ORGANIZATION_UNIT,
  SET_HUB_CA_LOCALITY,
  SET_HUB_CA_STATE,
  SET_HUB_CA_COUNTRY,
  CHANGE_HUB_CA_HOST,
  ADD_HUB_CA_HOST,
  REMOVE_HUB_CA_HOST,
  SET_HUB_CA_ROOT_CERTIFICATE,
  SET_HUB_CA_ROOT_CERTIFICATE_INFO,
  SHOW_HUB_CA_ROOT_CERTIFICATE_MODAL,
  HIDE_HUB_CA_ROOT_CERTIFICATE_MODAL,
} from './actions';

const hostInitialState = undefined;
const initialState = {
  hubCaError: undefined,
  hubCaCommonName: undefined,
  hubCaOrganization: undefined,
  hubCaOrganizationUnit: undefined,
  hubCaLocality: undefined,
  hubCaState: undefined,
  hubCaCountry: undefined,
  hubCaHosts: [],
  hubCaRootCertificate: undefined,
  hubCaRootCertificateInfo: undefined,
  isHubCaRootCertificateModalVisible: false,
};

const HubCa = handleActions(
  {
    [RESET_HUB_CA]: () => initialState,
    [SET_HUB_CA_ERROR]: (state, action) => ({
      ...state,
      hubCaError: action.payload,
    }),
    [SET_HUB_CA_COMMON_NAME]: (state, action) => ({
      ...state,
      hubCaCommonName: action.payload,
    }),
    [SET_HUB_CA_ORGANIZATION]: (state, action) => ({
      ...state,
      hubCaOrganization: action.payload,
    }),
    [SET_HUB_CA_ORGANIZATION_UNIT]: (state, action) => ({
      ...state,
      hubCaOrganizationUnit: action.payload,
    }),
    [SET_HUB_CA_LOCALITY]: (state, action) => ({
      ...state,
      hubCaLocality: action.payload,
    }),
    [SET_HUB_CA_STATE]: (state, action) => ({
      ...state,
      hubCaState: action.payload,
    }),
    [SET_HUB_CA_COUNTRY]: (state, action) => ({
      ...state,
      hubCaCountry: action.payload,
    }),
    [CHANGE_HUB_CA_HOST]: (state, action) => {
      const { index, value } = action.payload;
      return {
        ...state,
        hubCaHosts: [...state.hubCaHosts.slice(0, index), value, ...state.hubCaHosts.slice(index + 1)],
      };
    },
    [ADD_HUB_CA_HOST]: (state, action) => ({
      ...state,
      hubCaHosts: [...state.hubCaHosts, hostInitialState],
    }),
    [REMOVE_HUB_CA_HOST]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        hubCaHosts: [...state.hubCaHosts.slice(0, index), ...state.hubCaHosts.slice(index + 1)],
      };
    },
    [SET_HUB_CA_ROOT_CERTIFICATE]: (state, action) => ({
      // the server sends null for a non-existing certificate
      // causing the ui to fail on the fileuploader component
      // so it needs to be stored as an undefined value
      ...state,
      hubCaRootCertificate: action.payload || null,
    }),
    [SET_HUB_CA_ROOT_CERTIFICATE_INFO]: (state, action) => ({
      ...state,
      hubCaRootCertificateInfo: action.payload,
    }),
    [SHOW_HUB_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubCaRootCertificateModalVisible: true,
    }),
    [HIDE_HUB_CA_ROOT_CERTIFICATE_MODAL]: (state, action) => ({
      ...state,
      isHubCaRootCertificateModalVisible: false,
    }),
  },
  initialState
);

export default HubCa;
export { initialState };
