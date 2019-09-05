import { push } from 'connected-react-router';
import find from 'lodash/find';
import { setDfspId, initEnvironment, unsetEnvironmentId, unsetDfsps } from 'App/actions';
import { getDfsps } from 'App/selectors';
import { getJwt, getIsHubUser, getLoggedDfspId } from 'Auth/selectors';

export const selectHub = () => dispatch => dispatch(push('/hub'));

export const selectDFSP = dfspId => dispatch => {
  dispatch(setDfspId(dfspId));
  dispatch(push('/dfsp'));
};

export const selectEnvironment = id => async (dispatch, getState) => {
  if (getState().auth.login.isDisabled) {
    dispatch(initEnvironment(id));
    return;
  }

  await dispatch(initEnvironment(id));
  const isHubUser = getIsHubUser(getState());

  if (!getJwt(getState())) {
    dispatch(push('/login'));
    return;
  }

  if (isHubUser) {
    dispatch(push('/hub'));
    return;
  }

  const dfspId = getLoggedDfspId(getState());

  if (!dfspId) {
    dispatch(push('/login'));
    return;
  }

  if (!find(getDfsps(getState()), { id: dfspId })) {
    dispatch(push('/login'));
    return;
  }

  dispatch(setDfspId(dfspId));
  dispatch(push('/dfsp'));
};

export const clearEnvironment = () => dispatch => {
  dispatch(unsetEnvironmentId());
  dispatch(unsetDfsps());
};
