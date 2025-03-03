import { handleActions } from 'redux-actions';
import { SET_DFSP_LOADING, UNSET_DFSP_LOADING } from './actions';

const initialState = {
  isDfspLoading: true,
};

const Egress = handleActions(
  {
    [SET_DFSP_LOADING]: (state) => ({
      ...state,
      isDfspLoading: true,
    }),
    [UNSET_DFSP_LOADING]: (state) => ({
      ...state,
      isDfspLoading: false,
    }),
  },
  initialState
);

export default Egress;
export { initialState };
