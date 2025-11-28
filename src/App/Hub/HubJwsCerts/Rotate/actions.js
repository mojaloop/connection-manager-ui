import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';

export const ROTATE_HUB_JWS_CERTS = 'HUB JWS Certs Rotate / Reset';
export const ROTATE_HUB_JWS_CERTS_FINISHED = 'HUB JWS Certs Rotate / Reset Finished';

export const rotateHubJwsCerts = createAction(ROTATE_HUB_JWS_CERTS);
export const rotateHubJwsCertsFinished = createAction(ROTATE_HUB_JWS_CERTS_FINISHED);

export const rotateJwsCerts = () => async (dispatch, getState) => {
  dispatch(rotateHubJwsCerts());
  const { data, status } = await dispatch(api.hubRotateJWSCerts.update({}));

  if (is200(status) || is204(status)) {
    dispatch(showSuccessToast());
  } else {
    dispatch(showErrorModal(data?.error?.message || 'An error occurred while rotating JWS certificates.'));
  }
  dispatch(rotateHubJwsCertsFinished());
};
