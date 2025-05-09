import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is20x } from 'utils/http';
import { storeDFSPs } from 'App/actions';
import { getIsExistingDfsp, getHubDfspModalModel } from './selectors';

export const RESET_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Reset';
export const SET_HUB_DFSP_MODEL = 'HUB DFSP MODAL / Set Model';
export const SHOW_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Show';
export const HIDE_HUB_DFSP_MODAL = 'HUB DFSP MODAL / Hide';
export const SET_HUB_DFSP_MODAL_NAME = 'HUB DFSP MODAL / Set Name';
export const SET_HUB_DFSP_MODAL_ID = 'HUB DFSP MODAL / Set Id';
export const SET_HUB_DFSP_MODAL_MONETARY_ZONE = 'HUB DFSP MODAL / Set Monetary Zone';

export const resetHubDfspModal = createAction(RESET_HUB_DFSP_MODAL);
export const setHubDfspModel = createAction(SET_HUB_DFSP_MODEL);
export const showHubDfspModal = createAction(SHOW_HUB_DFSP_MODAL);
export const hideHubDfspModal = createAction(HIDE_HUB_DFSP_MODAL);
export const setHubDfspModalName = createAction(SET_HUB_DFSP_MODAL_NAME);
export const setHubDfspModalId = createAction(SET_HUB_DFSP_MODAL_ID);
export const setHubDfspModalMonetaryZone = createAction(SET_HUB_DFSP_MODAL_MONETARY_ZONE);

export const closeHubDfspModal = () => (dispatch) => {
  dispatch(hideHubDfspModal());
  dispatch(resetHubDfspModal());
};

export const submitHubDfspModal = () => async (dispatch, getState) => {
  const model = getHubDfspModalModel(getState());
  const isExistingDfsp = getIsExistingDfsp(getState());
  let result;

  if (isExistingDfsp) {
    result = await dispatch(api.dfsp.update({ dfspId: model.dfspId, body: model }));
  } else {
    result = await dispatch(api.dfsps.create({ body: model }));
  }

  if (is20x(result.status)) {
    dispatch(storeDFSPs());
    dispatch(resetHubDfspModal());
  }
};

export const openNewHubDfspModal = () => async (dispatch) => {
  dispatch(setHubDfspModel());
  dispatch(showHubDfspModal());
};

export const openExistingHubDfspModal = dfspModel => async (dispatch) => {
  dispatch(setHubDfspModel(dfspModel));
  dispatch(showHubDfspModal());
};
