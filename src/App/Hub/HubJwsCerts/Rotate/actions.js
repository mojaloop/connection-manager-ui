import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is204 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';

export const RESET_HUB_JWS_CERTS_ROTATE = 'HUB JWS Certs Rotate / Reset';
export const RESET_HUB_JWS_CERTS_ROTATE_FINISHED = 'HUB JWS Certs Rotate / Reset Finished';

export const resetHubJwsCertsRotate = createAction(RESET_HUB_JWS_CERTS_ROTATE);
export const resetHubJwsCertsRotateFinished = createAction(RESET_HUB_JWS_CERTS_ROTATE_FINISHED);

export const rotateJwsCerts = () => async (dispatch, getState) => {
  dispatch(resetHubJwsCertsRotate());
  const { data, status } = await dispatch(api.hubRotateJWSCerts.update({}));

  if (is200(status) || is204(status)) {
    dispatch(showSuccessToast());
  } else {
    dispatch(showErrorModal(data?.error?.message || 'An error occurred while rotating JWS certificates.'));
  }
  dispatch(resetHubJwsCertsRotateFinished());
};
