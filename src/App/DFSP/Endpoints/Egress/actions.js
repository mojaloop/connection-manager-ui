import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getEnvironmentId, getDfspId } from 'App/selectors';
import { getIpsOperations } from './selectors';
import { apiToIpModel, ipToApiModel } from './models';

export const RESET_DFSP_EGRESS = 'DFSP Egress / Reset';
export const SET_DFSP_EGRESS_IPS = 'DFSP Egress / Set Ips';
export const SET_DFSP_EGRESS_ERROR = 'DFSP Egress / Set Error';
export const CHANGE_DFSP_EGRESS_ADDRESS = 'DFSP Egress / Change IP';
export const CHANGE_DFSP_EGRESS_PORT = 'DFSP Egress / Change Port';
export const ADD_DFSP_EGRESS_IP = 'DFSP Egress / Add Configuration';
export const REMOVE_DFSP_EGRESS_IP = 'DFSP Egress / Remove Configuration';
export const ADD_DFSP_EGRESS_PORT = 'DFSP Egress / Add Port';
export const REMOVE_DFSP_EGRESS_PORT = 'DFSP Egress / Remove Port';
export const UNDO_DFSP_EGRESS_CHANGES = 'DFSP Egress / Undo Changes';

export const resetDfspEgress = createAction(RESET_DFSP_EGRESS);
export const setDfspEgressIps = createAction(SET_DFSP_EGRESS_IPS);
export const setDfspEgressError = createAction(SET_DFSP_EGRESS_ERROR);
export const changeDfspEgressAddress = createAction(CHANGE_DFSP_EGRESS_ADDRESS);
export const changeDfspEgressPort = createAction(CHANGE_DFSP_EGRESS_PORT);
export const addDfspEgressIp = createAction(ADD_DFSP_EGRESS_IP);
export const removeDfspEgressIp = createAction(REMOVE_DFSP_EGRESS_IP);
export const addDfspEgressPort = createAction(ADD_DFSP_EGRESS_PORT);
export const removeDfspEgressPort = createAction(REMOVE_DFSP_EGRESS_PORT);
export const undoDfspEgressChanges = createAction(UNDO_DFSP_EGRESS_CHANGES);

export const storeDfspEgressIps = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.egressIps.read({ environmentId, dfspId }));
  if (is200(status)) {
    const ips = data.map(apiToIpModel);
    dispatch(setDfspEgressIps(ips));
  } else {
    dispatch(setDfspEgressError(data));
  }
};

export const submitDfspEgressIps = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const dfspId = getDfspId(getState());
  const ipsOperations = getIpsOperations(getState());

  const createActions = ipsOperations.create.map(ip =>
    dispatch(api.egressIps.create({ environmentId, dfspId, body: ipToApiModel(ip) }))
  );
  const updateActions = ipsOperations.update.map(ip =>
    dispatch(api.egressIp.update({ environmentId, dfspId, ipId: ip.id, body: ipToApiModel(ip) }))
  );
  const deleteActions = ipsOperations.delete.map(ip =>
    dispatch(api.egressIp.delete({ environmentId, dfspId, ipId: ip.id }))
  );

  const results = await Promise.all([...createActions, ...updateActions, ...deleteActions]);

  const allSucceeded = results.every(({ status }) => is200(status) || is204(status));
  if (allSucceeded) {
    dispatch(showSuccessToast());
    dispatch(storeDfspEgressIps());
  } else {
    dispatch(showErrorModal());
  }
};
