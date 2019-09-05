import { handleActions } from 'redux-actions';
import {
  RESET_HUB_UNPROCESSED,
  SET_HUB_UNPROCESSED_ENDPOINTS,
  SET_HUB_UNPROCESSED_ENDPOINTS_ERROR,
  CHANGE_UNPROCESSED_ENDPOINTS_FILTER,
  CHANGE_HUB_UNPROCESSED_ENDPOINT_SELECTION,
} from './actions';

const initialState = {
  unprocessedEndpointsFilter: '',
  hubUnprocessedEndpoints: [],
  hubUnprocessedEndpointsError: undefined,
  confirming: {},
};

const Hub = handleActions(
  {
    [RESET_HUB_UNPROCESSED]: () => initialState,
    [SET_HUB_UNPROCESSED_ENDPOINTS]: (state, action) => ({
      ...state,
      hubUnprocessedEndpoints: action.payload,
    }),
    [SET_HUB_UNPROCESSED_ENDPOINTS_ERROR]: (state, action) => ({
      ...state,
      hubUnprocessedEndpointsError: action.payload,
    }),
    [CHANGE_UNPROCESSED_ENDPOINTS_FILTER]: (state, action) => ({
      ...state,
      unprocessedEndpointsFilter: action.payload || '',
    }),
    [CHANGE_HUB_UNPROCESSED_ENDPOINT_SELECTION]: (state, action) => {
      const { checked, id } = action.payload;
      return {
        ...state,
        confirming: {
          ...state.confirming,
          [id]: checked,
        },
      };
    },
  },
  initialState
);

export default Hub;
