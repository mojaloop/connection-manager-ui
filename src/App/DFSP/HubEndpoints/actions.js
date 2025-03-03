import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';

export const RESET_DFSP_HUB_ENDPOINTS = 'DFSP Hub Endpoints / Reset';
export const SET_DFSP_HUB_ENDPOINTS_ENDPOINTS = 'DFSP Hub Endpoints / Set Endpoints';
export const SET_DFSP_HUB_ENDPOINTS_ENDPOINTS_ERROR = 'DFSP Hub Endpoints / Set Endpoints Error';

export const resetDfspHubEndpoints = createAction(RESET_DFSP_HUB_ENDPOINTS);
export const setDfspHubEndpointsEndpoints = createAction(SET_DFSP_HUB_ENDPOINTS_ENDPOINTS);
export const setDfspHubEndpointsEndpointsError = createAction(SET_DFSP_HUB_ENDPOINTS_ENDPOINTS_ERROR);

const apiToUnprocessedModel = item => ({
  ...item,
});

export const storeDfspHubEndpoints = () => async (dispatch) => {
  const { data, status } = await dispatch(api.hubEndpoints.read());
  if (is200(status)) {
    const endpoints = data.map(apiToUnprocessedModel);
    dispatch(setDfspHubEndpointsEndpoints(endpoints));
  } else {
    dispatch(setDfspHubEndpointsEndpointsError(data));
  }
};
