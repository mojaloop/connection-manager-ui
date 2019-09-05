import { handleActions } from 'redux-actions';
import {
  RESET_HUB_DFSP_MODAL,
  SHOW_HUB_DFSP_MODAL,
  HIDE_HUB_DFSP_MODAL,
  SET_HUB_DFSP_MODAL_NAME,
  SET_HUB_DFSP_MODAL_ID,
} from './actions';

const initialState = {
  hubDfspName: undefined,
  hubDfspOverrideId: undefined,
  hubDfspDefaultId: undefined,
  isHubDfspOverrideIdSet: false,
  isHubDfspModalVisible: false,
};

const HubDfspModal = handleActions(
  {
    [RESET_HUB_DFSP_MODAL]: () => initialState,
    [SET_HUB_DFSP_MODAL_NAME]: (state, action) => ({
      ...state,
      hubDfspName: action.payload,
      hubDfspDefaultId: action.payload,
    }),
    [SET_HUB_DFSP_MODAL_ID]: (state, action) => ({
      ...state,
      hubDfspOverrideId: action.payload,
      isHubDfspOverrideIdSet: true,
    }),
    [SHOW_HUB_DFSP_MODAL]: (state, action) => ({
      ...state,
      isHubDfspModalVisible: true,
    }),
    [HIDE_HUB_DFSP_MODAL]: (state, action) => ({
      ...state,
      isHubDfspModalVisible: false,
    }),
  },
  initialState
);

export default HubDfspModal;
export { initialState };
