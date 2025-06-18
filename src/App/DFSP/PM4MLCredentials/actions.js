import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is20x, is404 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';

export const SET_DFSP_CREDENTIALS_PENDING = 'DFSP PM4ML CREDENTIALS / Set Pending';
export const SET_DFSP_CREDENTIALS_ERROR = 'DFSP PM4ML CREDENTIALS / Set Error';
export const CLEAR_DFSP_CREDENTIALS_STATE = 'DFSP PM4ML CREDENTIALS / Clear State';
export const SET_DFSP_CREDENTIALS_EXISTS = 'DFSP PM4ML CREDENTIALS / Set Exists';

export const setDfspCredentialsPending = createAction(SET_DFSP_CREDENTIALS_PENDING);
export const setDfspCredentialsError = createAction(SET_DFSP_CREDENTIALS_ERROR);
export const clearDfspCredentialsState = createAction(CLEAR_DFSP_CREDENTIALS_STATE);
export const setDfspCredentialsExists = createAction(SET_DFSP_CREDENTIALS_EXISTS);

// Check if credentials exist (for initial load)
export const checkDfspCredentials = (dfspId) => async (dispatch) => {
  dispatch(setDfspCredentialsPending(true));

  try {
    const { status } = await dispatch(api.dfspCredentials.read({ dfspId }));
    
    if (is200(status)) {
      dispatch(setDfspCredentialsExists(true));
    } else if (is404(status)) {
      dispatch(setDfspCredentialsExists(false));
    } else {
      dispatch(setDfspCredentialsError('Failed to check credentials'));
      dispatch(showErrorModal({ status, data: { message: 'Failed to check credentials' } }));
    }
  } catch (error) {
    dispatch(setDfspCredentialsError('Network error occurred'));
    dispatch(showErrorModal({ status: 500, data: { message: 'Network error' } }));
  } finally {
    dispatch(setDfspCredentialsPending(false));
  }
};

export const fetchDfspCredentials = (dfspId) => async (dispatch) => {
  dispatch(setDfspCredentialsPending(true));

  try {
    const { data, status } = await dispatch(api.dfspCredentials.read({ dfspId }));
    
    if (is200(status)) {
      dispatch(setDfspCredentialsExists(true));
      return data;
    } else if (is404(status)) {
      dispatch(setDfspCredentialsExists(false));
      return null;
    } else {
      dispatch(setDfspCredentialsError('Failed to fetch credentials'));
      dispatch(showErrorModal({ status, data }));
      return null;
    }
  } catch (error) {
    dispatch(setDfspCredentialsError('Network error occurred'));
    dispatch(showErrorModal({ status: 500, data: { message: 'Network error' } }));
    return null;
  } finally {
    dispatch(setDfspCredentialsPending(false));
  }
};

export const createDfspCredentials = (dfspId) => async (dispatch) => {
  dispatch(setDfspCredentialsPending(true));

  try {
    const { data, status } = await dispatch(api.dfspCredentials.create({ 
      dfspId, 
      body: {}
    }));
    
    if (is20x(status)) {
      dispatch(setDfspCredentialsExists(true));
      dispatch(showSuccessToast('PM4ML credentials generated successfully'));
      return data;
    } else {
      dispatch(setDfspCredentialsError('Failed to generate credentials'));
      dispatch(showErrorModal({ status, data }));
      return null;
    }
  } catch (error) {
    dispatch(setDfspCredentialsError('Network error occurred'));
    dispatch(showErrorModal({ status: 500, data: { message: 'Network error' } }));
    return null;
  } finally {
    dispatch(setDfspCredentialsPending(false));
  }
};

 