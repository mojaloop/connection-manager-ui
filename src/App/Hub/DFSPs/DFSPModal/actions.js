import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is20x } from 'utils/http';
import { getEnvironmentId } from 'App/selectors';
import { storeDFSPs } from 'App/actions';
import { getHubDfspModalModel } from './selectors';

export const RESET_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Reset';
export const SHOW_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Show';
export const HIDE_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Hide';
export const SET_HUB_DFSP_MODAL_NAME = 'HUB DFSP MODAL / Set Name';
export const SET_HUB_DFSP_MODAL_ID = 'HUB DFSP MODAL / Set Id';

export const resetHubDfspModal = createAction(RESET_HUB_DFSP_MODAL);
export const showHubDfspModal = createAction(SHOW_HUB_DFSP_MODAL);
export const hideHubDfspModal = createAction(HIDE_HUB_DFSP_MODAL);
export const setHubDfspModalName = createAction(SET_HUB_DFSP_MODAL_NAME);
export const setHubDfspModalId = createAction(SET_HUB_DFSP_MODAL_ID);

export const closeHubDfspModal = () => (dispatch, getState) => {
  dispatch(hideHubDfspModal());
  dispatch(resetHubDfspModal());
};

export const submitHubDfspModal = () => async (dispatch, getState) => {
  const model = getHubDfspModalModel(getState());
  const environmentId = getEnvironmentId(getState());

  const { status } = await dispatch(api.dfsps.create({ environmentId, body: model }));

  if (is20x(status)) {
    dispatch(storeDFSPs(environmentId));
    dispatch(resetHubDfspModal());
  }
};
