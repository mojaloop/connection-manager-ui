import { handleActions } from 'redux-actions';
import {
  ROTATE_HUB_JWS_CERTS,
  ROTATE_HUB_JWS_CERTS_FINISHED
} from './actions';

const initialState = {
  rotateJWSCertsPending: false,
};

const HubJwsCertsRotate = handleActions(
  {
    [ROTATE_HUB_JWS_CERTS]: (state, action) => ({
      ...state,
      rotateJWSCertsPending: true,
    }),
    [ROTATE_HUB_JWS_CERTS_FINISHED]: (state, action) => ({
      ...state,
      rotateJWSCertsPending: false,
    })
  },
  initialState
);

export default HubJwsCertsRotate;
