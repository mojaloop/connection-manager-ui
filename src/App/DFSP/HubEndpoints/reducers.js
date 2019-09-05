import { handleActions } from 'redux-actions';
import {
  RESET_DFSP_HUB_ENDPOINTS,
  SET_DFSP_HUB_ENDPOINTS_ENDPOINTS,
  SET_DFSP_HUB_ENDPOINTS_ENDPOINTS_ERROR,
} from './actions';

const initialState = {
  dfspHubEndpoints: [],
  dfspHubEndpointsError: undefined,
};

const dfspHubEndpoints = handleActions(
  {
    [RESET_DFSP_HUB_ENDPOINTS]: () => initialState,
    [SET_DFSP_HUB_ENDPOINTS_ENDPOINTS]: (state, action) => ({
      ...state,
      dfspHubEndpoints: action.payload,
    }),
    [SET_DFSP_HUB_ENDPOINTS_ENDPOINTS_ERROR]: (state, action) => ({
      ...state,
      dfspHubEndpointsError: action.payload,
    }),
  },
  initialState
);

export default dfspHubEndpoints;
