import { handleActions } from 'redux-actions';
import {
  RESET_HUB_JWS_CERTS_ROTATE,
  RESET_HUB_JWS_CERTS_ROTATE_FINISHED
} from './actions';

const initialState = {
  rotateJWSCertsError: null,
  rotateJWSCertsPending: false,
};

const HubJwsCertsRotate = handleActions(
  {
    [RESET_HUB_JWS_CERTS_ROTATE]: (state, action) => ({
      ...state,
      rotateJWSCertsPending: true,
    }),
    [RESET_HUB_JWS_CERTS_ROTATE_FINISHED]: (state, action) => ({
      ...state,
      rotateJWSCertsPending: false,
    })
  },
  initialState
);

export default HubJwsCertsRotate;
