import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getIpsOperations } from './selectors';
import { apiToIpModel, ipToApiModel } from './models';

export const RESET_HUB_EGRESS = 'HUB Egress / Reset';
export const SET_HUB_EGRESS_IPS = 'HUB Egress / Set Ips';
export const SET_HUB_EGRESS_ERROR = 'HUB Egress / Set Error';
export const CHANGE_HUB_EGRESS_ADDRESS = 'HUB Egress / Change IP';
export const CHANGE_HUB_EGRESS_PORT = 'HUB Egress / Change Port';
export const ADD_HUB_EGRESS_IP = 'HUB Egress / Add Configuration';
export const REMOVE_HUB_EGRESS_IP = 'HUB Egress / Remove Configuration';
export const ADD_HUB_EGRESS_PORT = 'HUB Egress / Add Port';
export const REMOVE_HUB_EGRESS_PORT = 'HUB Egress / Remove Port';
export const UNDO_HUB_EGRESS_CHANGES = 'HUB Egress / Undo Changes';

export const resetHubEgress = createAction(RESET_HUB_EGRESS);
export const setHubEgressIps = createAction(SET_HUB_EGRESS_IPS);
export const setHubEgressError = createAction(SET_HUB_EGRESS_ERROR);
export const changeHubEgressAddress = createAction(CHANGE_HUB_EGRESS_ADDRESS);
export const changeHubEgressPort = createAction(CHANGE_HUB_EGRESS_PORT);
export const addHubEgressIp = createAction(ADD_HUB_EGRESS_IP);
export const removeHubEgressIp = createAction(REMOVE_HUB_EGRESS_IP);
export const addHubEgressPort = createAction(ADD_HUB_EGRESS_PORT);
export const removeHubEgressPort = createAction(REMOVE_HUB_EGRESS_PORT);
export const undoHubEgressChanges = createAction(UNDO_HUB_EGRESS_CHANGES);

export const storeHubEgressIps = () => async (dispatch) => {
  const { data, status } = await dispatch(api.hubEgressIps.read());
  if (is200(status)) {
    const ips = data.map(apiToIpModel);
    dispatch(setHubEgressIps(ips));
  } else {
    dispatch(setHubEgressError(data));
  }
};

export const submitHubEgressIps = () => async (dispatch, getState) => {
  const ipsOperations = getIpsOperations(getState());

  const createActions = ipsOperations.create.map(ip => dispatch(api.hubEgressIps.create({ body: ipToApiModel(ip) })));
  const updateActions = ipsOperations.update.map(ip =>
    dispatch(api.hubEgressIp.update({ ipId: ip.id, body: ipToApiModel(ip) }))
  );
  const deleteActions = ipsOperations.delete.map(ip => dispatch(api.hubEgressIp.delete({ ipId: ip.id })));

  const results = await Promise.all([...createActions, ...updateActions, ...deleteActions]);

  const allSucceeded = results.every(({ status }) => is200(status) || is204(status));
  if (allSucceeded) {
    dispatch(showSuccessToast());
    dispatch(storeHubEgressIps());
  } else {
    dispatch(showErrorModal());
  }
};
