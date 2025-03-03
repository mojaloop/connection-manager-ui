import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfspId } from 'App/selectors';
import { getUrlsOperations, getIpsOperations } from './selectors';
import { apiToIpModel, apiToUrlModel, ipToApiModel, urlToApiModel } from './models';

export const RESET_DFSP_INGRESS = 'DFSP Ingress / Reset';
export const SET_DFSP_INGRESS_URLS = 'DFSP Ingress / Set Urls';
export const SET_DFSP_INGRESS_URLS_ERROR = 'DFSP Ingress / Set Urls Error';
export const SET_DFSP_INGRESS_IPS = 'DFSP Ingress / Set Ips';
export const SET_DFSP_INGRESS_IPS_ERROR = 'DFSP Ingress / Set Ips Error';
export const CHANGE_DFSP_INGRESS_URL = 'DFSP Ingress / Change URL';
export const CHANGE_DFSP_INGRESS_ADDRESS = 'DFSP Ingress / Change IP';
export const CHANGE_DFSP_INGRESS_PORT = 'DFSP Ingress / Change Port';
export const ADD_DFSP_INGRESS_IP = 'DFSP Ingress / Add Configuration';
export const REMOVE_DFSP_INGRESS_IP = 'DFSP Ingress / Remove Configuration';
export const ADD_DFSP_INGRESS_PORT = 'DFSP Ingress / Add Port';
export const REMOVE_DFSP_INGRESS_PORT = 'DFSP Ingress / Remove Port';
export const UNDO_DFSP_INGRESS_CHANGES = 'DFSP Ingress / Undo Changes';

export const resetDfspIngress = createAction(RESET_DFSP_INGRESS);
export const setDfspIngressUrls = createAction(SET_DFSP_INGRESS_URLS);
export const setDfspIngressUrlsError = createAction(SET_DFSP_INGRESS_URLS_ERROR);
export const setDfspIngressIps = createAction(SET_DFSP_INGRESS_IPS);
export const setDfspIngressIpsError = createAction(SET_DFSP_INGRESS_IPS_ERROR);
export const changeDfspIngressUrl = createAction(CHANGE_DFSP_INGRESS_URL);
export const changeDfspIngressAddress = createAction(CHANGE_DFSP_INGRESS_ADDRESS);
export const changeDfspIngressPort = createAction(CHANGE_DFSP_INGRESS_PORT);
export const addDfspIngressIp = createAction(ADD_DFSP_INGRESS_IP);
export const removeDfspIngressIp = createAction(REMOVE_DFSP_INGRESS_IP);
export const addDfspIngressPort = createAction(ADD_DFSP_INGRESS_PORT);
export const removeDfspIngressPort = createAction(REMOVE_DFSP_INGRESS_PORT);
export const undoDfspIngressChanges = createAction(UNDO_DFSP_INGRESS_CHANGES);

export const storeDfspIngressUrls = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.ingressUrls.read({ dfspId }));
  if (is200(status)) {
    const urls = data.map(apiToUrlModel);
    dispatch(setDfspIngressUrls(urls));
  } else {
    dispatch(setDfspIngressUrlsError(data));
  }
};
export const storeDfspIngressIps = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.ingressIps.read({ dfspId }));
  if (is200(status)) {
    const ips = data.map(apiToIpModel);
    dispatch(setDfspIngressIps(ips));
  } else {
    dispatch(setDfspIngressIpsError(data));
  }
};

export const storeDfspEndpoints = () => async (dispatch) => {
  return Promise.all([dispatch(storeDfspIngressUrls()), dispatch(storeDfspIngressIps())]);
};

export const submitDfspIngressEndpoints = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const urlsOperations = getUrlsOperations(getState());
  const ipsOperations = getIpsOperations(getState());

  const createUrlsActions = urlsOperations.create.map(url =>
    dispatch(api.ingressUrls.create({ dfspId, body: urlToApiModel(url) }))
  );
  const updateUrlsActions = urlsOperations.update.map(url =>
    dispatch(api.ingressUrl.update({ dfspId, urlId: url.id, body: urlToApiModel(url) }))
  );
  const deleteUrlsActions = urlsOperations.delete.map(url =>
    dispatch(api.ingressUrl.delete({ dfspId, urlId: url.id }))
  );
  const createIpsActions = ipsOperations.create.map(ip =>
    dispatch(api.ingressIps.create({ dfspId, body: ipToApiModel(ip) }))
  );
  const updateIpsActions = ipsOperations.update.map(ip =>
    dispatch(api.ingressIp.update({ dfspId, ipId: ip.id, body: ipToApiModel(ip) }))
  );
  const deleteIpsActions = ipsOperations.delete.map(ip => dispatch(api.ingressIp.delete({ dfspId, ipId: ip.id })));

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
    dispatch(storeDfspEndpoints());
  } else {
    dispatch(showErrorModal());
  }
};
