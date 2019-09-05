import { handleActions } from 'redux-actions';
import isEqual from 'lodash/isEqual';
import { STATES } from '../constants';
import {
  RESET_HUB_EGRESS,
  SET_HUB_EGRESS_IPS,
  SET_HUB_EGRESS_ERROR,
  CHANGE_HUB_EGRESS_ADDRESS,
  CHANGE_HUB_EGRESS_PORT,
  ADD_HUB_EGRESS_IP,
  REMOVE_HUB_EGRESS_IP,
  ADD_HUB_EGRESS_PORT,
  REMOVE_HUB_EGRESS_PORT,
  UNDO_HUB_EGRESS_CHANGES,
} from './actions';

const initialEgressIp = {
  id: undefined,
  state: STATES.UNSET,
  address: undefined,
  ports: [undefined],
};

const initialState = {
  previousEgressIps: [initialEgressIp],
  egressIps: [initialEgressIp],
  egressError: undefined,
};

const Egress = handleActions(
  {
    [RESET_HUB_EGRESS]: () => initialState,
    [SET_HUB_EGRESS_IPS]: (state, action) => {
      // we should set an empty ip structure
      // if the dfsp has no ips set
      let ips = action.payload;
      if (isEqual(ips, [])) {
        ips = [initialEgressIp];
      }
      return {
        ...state,
        previousEgressIps: ips,
        egressIps: ips,
      };
    },
    [SET_HUB_EGRESS_ERROR]: (state, action) => ({
      ...state,
      egressError: action.payload,
    }),
    [CHANGE_HUB_EGRESS_ADDRESS]: (state, action) => {
      const { address, index } = action.payload;
      return {
        ...state,
        egressIps: [
          ...state.egressIps.slice(0, index),
          {
            ...state.egressIps[index],
            address,
          },
          ...state.egressIps.slice(index + 1),
        ],
      };
    },
    [CHANGE_HUB_EGRESS_PORT]: (state, action) => {
      const { port, index, portIndex } = action.payload;
      return {
        ...state,
        egressIps: [
          ...state.egressIps.slice(0, index),
          {
            ...state.egressIps[index],
            ports: [
              ...state.egressIps[index].ports.slice(0, portIndex),
              port,
              ...state.egressIps[index].ports.slice(portIndex + 1),
            ],
          },
          ...state.egressIps.slice(index + 1),
        ],
      };
    },
    [ADD_HUB_EGRESS_IP]: state => ({
      ...state,
      egressIps: [...state.egressIps, initialEgressIp],
    }),
    [REMOVE_HUB_EGRESS_IP]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        egressIps: [...state.egressIps.slice(0, index), ...state.egressIps.slice(index + 1)],
      };
    },
    [ADD_HUB_EGRESS_PORT]: (state, action) => {
      const index = action.payload;
      return {
        ...state,
        egressIps: [
          ...state.egressIps.slice(0, index),
          {
            ...state.egressIps[index],
            ports: [...state.egressIps[index].ports, undefined],
          },
          ...state.egressIps.slice(index + 1),
        ],
      };
    },
    [REMOVE_HUB_EGRESS_PORT]: (state, action) => {
      const { portIndex, index } = action.payload;
      return {
        ...state,
        egressIps: [
          ...state.egressIps.slice(0, index),
          {
            ...state.egressIps[index],
            ports: [
              ...state.egressIps[index].ports.slice(0, portIndex),
              ...state.egressIps[index].ports.slice(portIndex + 1),
            ],
          },
          ...state.egressIps.slice(index + 1),
        ],
      };
    },
    [UNDO_HUB_EGRESS_CHANGES]: state => ({
      ...state,
      egressIps: [...state.previousEgressIps],
    }),
  },
  initialState
);

export default Egress;
export { initialState, initialEgressIp };
