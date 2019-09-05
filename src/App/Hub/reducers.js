import { handleActions } from 'redux-actions';
import { SET_HUB_LOADING, UNSET_HUB_LOADING } from './actions';

const initialState = {
  isHubLoading: true,
};

const Egress = handleActions(
  {
    [SET_HUB_LOADING]: (state, action) => ({
      ...state,
      isHubLoading: true,
    }),
    [UNSET_HUB_LOADING]: (state, action) => ({
      ...state,
      isHubLoading: false,
    }),
  },
  initialState
);

export default Egress;
export { initialState };
