import { handleActions } from 'redux-actions';

import { RESET_TOTP, ACKNOWLEDGE_QR_SCAN, CHANGE_TOTP_CODE, UNSET_TOTP_CODE } from './actions';

const initialState = {
  isQrScanAcknowledged: false,
  code: undefined,
};

const Auth = handleActions(
  {
    [RESET_TOTP]: (state, action) => ({
      ...initialState,
    }),
    [ACKNOWLEDGE_QR_SCAN]: (state, action) => ({
      ...state,
      isQrScanAcknowledged: action.payload,
    }),
    [CHANGE_TOTP_CODE]: (state, action) => ({
      ...state,
      code: action.payload,
    }),
    [UNSET_TOTP_CODE]: (state, action) => ({
      ...state,
      code: initialState.code,
    }),
  },
  initialState
);

export default Auth;
export { initialState };
