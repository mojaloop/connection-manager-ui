import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getUrlsOperations, getIpsOperations } from './selectors';

import { apiToIpModel, apiToUrlModel, ipToApiModel, urlToApiModel } from './models';

export const RESET_HUB_INGRESS = 'HUB Ingress / Reset';
export const SET_HUB_INGRESS_URLS = 'HUB Ingress / Set Urls';
export const SET_HUB_INGRESS_URLS_ERROR = 'HUB Ingress / Set Urls Error';
export const SET_HUB_INGRESS_IPS = 'HUB Ingress / Set Ips';
export const SET_HUB_INGRESS_IPS_ERROR = 'HUB Ingress / Set Ips Error';
export const CHANGE_HUB_INGRESS_URL = 'HUB Ingress / Change URL';
export const CHANGE_HUB_INGRESS_ADDRESS = 'HUB Ingress / Change IP';
export const CHANGE_HUB_INGRESS_PORT = 'HUB Ingress / Change Port';
export const ADD_HUB_INGRESS_IP = 'HUB Ingress / Add Configuration';
export const REMOVE_HUB_INGRESS_IP = 'HUB Ingress / Remove Configuration';
export const ADD_HUB_INGRESS_PORT = 'HUB Ingress / Add Port';
export const REMOVE_HUB_INGRESS_PORT = 'HUB Ingress / Remove Port';
export const UNDO_HUB_INGRESS_CHANGES = 'HUB Ingress / Undo Changes';

export const resetHubIngress = createAction(RESET_HUB_INGRESS);
export const setHubIngressUrls = createAction(SET_HUB_INGRESS_URLS);
export const setHubIngressUrlsError = createAction(SET_HUB_INGRESS_URLS_ERROR);
export const setHubIngressIps = createAction(SET_HUB_INGRESS_IPS);
export const setHubIngressIpsError = createAction(SET_HUB_INGRESS_IPS_ERROR);
export const changeHubIngressUrl = createAction(CHANGE_HUB_INGRESS_URL);
export const changeHubIngressAddress = createAction(CHANGE_HUB_INGRESS_ADDRESS);
export const changeHubIngressPort = createAction(CHANGE_HUB_INGRESS_PORT);
export const addHubIngressIp = createAction(ADD_HUB_INGRESS_IP);
export const removeHubIngressIp = createAction(REMOVE_HUB_INGRESS_IP);
export const addHubIngressPort = createAction(ADD_HUB_INGRESS_PORT);
export const removeHubIngressPort = createAction(REMOVE_HUB_INGRESS_PORT);
export const undoHubIngressChanges = createAction(UNDO_HUB_INGRESS_CHANGES);

export const storeHubIngressUrls = () => async (dispatch) => {
  const { data, status } = await dispatch(api.hubIngressUrls.read());
  if (is200(status)) {
    const urls = data.map(apiToUrlModel);
    dispatch(setHubIngressUrls(urls));
  } else {
    dispatch(setHubIngressUrlsError(data));
  }
};
export const storeHubIngressIps = () => async (dispatch) => {
  const { data, status } = await dispatch(api.hubIngressIps.read());
  if (is200(status)) {
    const ips = data.map(apiToIpModel);
    dispatch(setHubIngressIps(ips));
  } else {
    dispatch(setHubIngressIpsError(data));
  }
};

export const storeHubEndpoints = () => async (dispatch) => {
  return Promise.all([dispatch(storeHubIngressUrls()), dispatch(storeHubIngressIps())]);
};

export const submitHubIngressEndpoints = () => async (dispatch, getState) => {
  const urlsOperations = getUrlsOperations(getState());
  const ipsOperations = getIpsOperations(getState());

  const createUrlsActions = urlsOperations.create.map(url =>
    dispatch(api.hubIngressUrls.create({ body: urlToApiModel(url) }))
  );
  const updateUrlsActions = urlsOperations.update.map(url =>
    dispatch(api.hubIngressUrl.update({ urlId: url.id, body: urlToApiModel(url) }))
  );
  const deleteUrlsActions = urlsOperations.delete.map(url => dispatch(api.hubIngressUrl.delete({ urlId: url.id })));
  const createIpsActions = ipsOperations.create.map(ip =>
    dispatch(api.hubIngressIps.create({ body: ipToApiModel(ip) }))
  );
  const updateIpsActions = ipsOperations.update.map(ip =>
    dispatch(api.hubIngressIp.update({ ipId: ip.id, body: ipToApiModel(ip) }))
  );
  const deleteIpsActions = ipsOperations.delete.map(ip => dispatch(api.hubIngressIp.delete({ ipId: ip.id })));

  const results = await Promise.all([
    ...createUrlsActions,
    ...updateUrlsActions,
    ...deleteUrlsActions,
    ...createIpsActions,
    ...updateIpsActions,
    ...deleteIpsActions,
  ]);

  const allSucceeded = results.every(({ status }) => is200(status) || is204(status));
  if (allSucceeded) {
    dispatch(showSuccessToast());
    dispatch(storeHubEndpoints());
  } else {
    dispatch(showErrorModal());
  }
};
