import { handleActions } from 'redux-actions';
import isEqual from 'lodash/isEqual';
import { STATES } from '../constants';
import {
  RESET_DFSP_INGRESS,
  SET_DFSP_INGRESS_URLS,
  SET_DFSP_INGRESS_URLS_ERROR,
  SET_DFSP_INGRESS_IPS,
  SET_DFSP_INGRESS_IPS_ERROR,
  CHANGE_DFSP_INGRESS_URL,
  CHANGE_DFSP_INGRESS_ADDRESS,
  CHANGE_DFSP_INGRESS_PORT,
  ADD_DFSP_INGRESS_IP,
  REMOVE_DFSP_INGRESS_IP,
  ADD_DFSP_INGRESS_PORT,
  REMOVE_DFSP_INGRESS_PORT,
  UNDO_DFSP_INGRESS_CHANGES,
} from './actions';

const initialIngressIp = {
  id: undefined,
  state: STATES.UNSET,
  address: undefined,
  ports: [undefined],
};
const initialIngressUrl = {
  id: undefined,
  state: STATES.UNSET,
  url: undefined,
};

const initialState = {
  previousIngressUrls: [initialIngressUrl],
  ingressUrlsError: undefined,
  ingressUrls: [initialIngressUrl],
  previousIngressIps: [initialIngressIp],
  ingressIpsError: undefined,
  ingressIps: [initialIngressIp],
};

const Ingress = handleActions(
  {
    [RESET_DFSP_INGRESS]: () => initialState,
    [SET_DFSP_INGRESS_URLS]: (state, action) => {
      // we should set an empty url structure
      // if the dfsp has no urls set
      let urls = action.payload;
      if (isEqual(urls, [])) {
        urls = [initialIngressUrl];
      }
      return {
        ...state,
        previousIngressUrls: urls,
        ingressUrls: urls,
      };
    },
    [SET_DFSP_INGRESS_URLS_ERROR]: (state, action) => ({
      ...state,
      ingressUrlsError: action.payload,
    }),
    [SET_DFSP_INGRESS_IPS]: (state, action) => {
      // we should set an empty ip structure
      // if the dfsp has no ips set
      let ips = action.payload;
      if (isEqual(ips, [])) {
        ips = [initialIngressIp];
      }
      return {
        ...state,
        previousIngressIps: ips,
        ingressIps: ips,
      };
    },
    [SET_DFSP_INGRESS_IPS_ERROR]: (state, action) => ({
      ...state,
      ingressIpsError: action.payload,
    }),
    [CHANGE_DFSP_INGRESS_URL]: (state, action) => {
      const { url, index } = action.payload;
      return {
        ...state,
        ingressUrls: [
          ...state.ingressUrls.slice(0, index),
          {
            ...state.ingressUrls[index],
            url,
          },
          ...state.ingressUrls.slice(index + 1),
        ],
      };
    },
    [CHANGE_DFSP_INGRESS_ADDRESS]: (state, action) => {
      const { address, index } = action.payload;
      return {
        ...state,
        ingressIps: [
          ...state.ingressIps.slice(0, index),
          {
            ...state.ingressIps[index],
            address,
          },
          ...state.ingressIps.slice(index + 1),
        ],
      };
    },
    [CHANGE_DFSP_INGRESS_PORT]: (state, action) => {
      const { port, index, portIndex } = action.payload;
      return {
        ...state,
        ingressIps: [
          ...state.ingressIps.slice(0, index),
          {
            ...state.ingressIps[index],
            ports: [
              ...state.ingressIps[index].ports.slice(0, portIndex),
              port,
              ...state.ingressIps[index].ports.slice(portIndex + 1),
            ],
          },
          ...state.ingressIps.slice(index + 1),
        ],
      };
    },
    [ADD_DFSP_INGRESS_IP]: state => ({
      ...state,
      ingressIps: [...state.ingressIps, initialIngressIp],
    }),
    [REMOVE_DFSP_INGRESS_IP]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        ingressIps: [...state.ingressIps.slice(0, index), ...state.ingressIps.slice(index + 1)],
      };
    },
    [ADD_DFSP_INGRESS_PORT]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        ingressIps: [
          ...state.ingressIps.slice(0, index),
          {
            ...state.ingressIps[index],
            ports: [...state.ingressIps[index].ports, undefined],
          },
          ...state.ingressIps.slice(index + 1),
        ],
      };
    },
    [REMOVE_DFSP_INGRESS_PORT]: (state, action) => {
      const { portIndex, index } = action.payload;
      return {
        ...state,
        ingressIps: [
          ...state.ingressIps.slice(0, index),
          {
            ...state.ingressIps[index],
            ports: [
              ...state.ingressIps[index].ports.slice(0, portIndex),
              ...state.ingressIps[index].ports.slice(portIndex + 1),
            ],
          },
          ...state.ingressIps.slice(index + 1),
        ],
      };
    },
    [UNDO_DFSP_INGRESS_CHANGES]: state => ({
      ...state,
      ingressUrls: [...state.previousIngressUrls],
      ingressIps: [...state.previousIngressIps],
    }),
  },
  initialState
);

export default Ingress;
export { initialState, initialIngressIp, initialIngressUrl };
