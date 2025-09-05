import { handleActions } from 'redux-actions';
import {
  SET_DFSP_CREDENTIALS_PENDING,
  SET_DFSP_CREDENTIALS_ERROR,
  CLEAR_DFSP_CREDENTIALS_STATE,
  SET_DFSP_CREDENTIALS_EXISTS,
} from './actions';

const initialState = {
  credentialsExist: false, // Only track if credentials exist, not the actual values
  isPending: false,
  error: null,
};

const PM4MLCredentials = handleActions(
  {
    [SET_DFSP_CREDENTIALS_EXISTS]: (state, action) => ({
      ...state,
      credentialsExist: action.payload,
      error: null,
    }),
    [SET_DFSP_CREDENTIALS_PENDING]: (state, action) => ({
      ...state,
      isPending: action.payload,
    }),
    [SET_DFSP_CREDENTIALS_ERROR]: (state, action) => ({
      ...state,
      error: action.payload,
      ...(action.payload && { isPending: false }),
    }),
    [CLEAR_DFSP_CREDENTIALS_STATE]: (state) => ({
      ...state,
      credentialsExist: false,
      error: null,
    }),
  },
  initialState
);

export default PM4MLCredentials; 