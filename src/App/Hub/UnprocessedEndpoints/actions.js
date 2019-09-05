import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import find from 'lodash/find';
import { getEnvironmentId } from 'App/selectors';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getHubUnprocessedEndpointsByDFSP } from './selectors';

export const RESET_HUB_UNPROCESSED = 'HUB Unprocessed / Reset';
export const SET_HUB_UNPROCESSED_ENDPOINTS = 'HUB Unprocessed / Set Endpoints';
export const SET_HUB_UNPROCESSED_ENDPOINTS_ERROR = 'HUB Unprocessed / Set Endpoints Error';
export const CHANGE_UNPROCESSED_ENDPOINTS_FILTER = 'HUB Unprocessed / Change Endpoint Filter';
export const CHANGE_HUB_UNPROCESSED_ENDPOINT_SELECTION = 'HUB Unprocessed / Change Endpoint Selection';

export const resetHubUnprocessed = createAction(RESET_HUB_UNPROCESSED);
export const setHubUnprocessedEndpoints = createAction(SET_HUB_UNPROCESSED_ENDPOINTS);
export const setHubUnprocessedEndpointsError = createAction(SET_HUB_UNPROCESSED_ENDPOINTS_ERROR);
export const changeUnprocessedEndpointsFilter = createAction(CHANGE_UNPROCESSED_ENDPOINTS_FILTER);
export const changeHubUnprocessedEndpointSelection = createAction(CHANGE_HUB_UNPROCESSED_ENDPOINT_SELECTION);

const apiToUnprocessedModel = item => ({
  ...item,
});

export const storeUnprocessedEndpoints = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const { data, status } = await dispatch(api.unprocessedEndpoints.read({ environmentId }));
  if (is200(status)) {
    const endpoints = data.map(apiToUnprocessedModel);
    dispatch(setHubUnprocessedEndpoints(endpoints));
  } else {
    dispatch(setHubUnprocessedEndpointsError(data));
  }
};

export const submitUnprocessedEndpoints = selection => async (dispatch, getState) => {
  const { dfspId, direction } = selection;
  const environmentId = getEnvironmentId(getState());
  const endpoints = getHubUnprocessedEndpointsByDFSP(getState());
  const endpointsByDfspId = find(endpoints, { dfspId });
  const endpointsByDirection = endpointsByDfspId[direction];

  const ids = endpointsByDirection.filter(endpoint => endpoint.checked).map(endpoint => endpoint.id);
  const apiCalls = ids.map(endpointId => dispatch(api.confirmEndpoint.create({ environmentId, dfspId, endpointId })));

  const results = await Promise.all(apiCalls);
  if (results.every(({ status }) => is200(status))) {
    dispatch(showSuccessToast());
    dispatch(storeUnprocessedEndpoints());
  } else {
    dispatch(showErrorModal());
  }
};

export const toggleConfirmingEndpoint = () => (dispatch, getState) => {};
