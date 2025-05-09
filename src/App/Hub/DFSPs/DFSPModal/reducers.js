import { handleActions } from 'redux-actions';
import {
  RESET_HUB_DFSP_MODAL,
  SET_HUB_DFSP_MODEL,
  SHOW_HUB_DFSP_MODAL,
  HIDE_HUB_DFSP_MODAL,
  SET_HUB_DFSP_MODAL_NAME,
  SET_HUB_DFSP_MODAL_ID,
  SET_HUB_DFSP_MODAL_MONETARY_ZONE,
} from './actions';

const initialHubDfspModel = {
  id: undefined,
  name: '',
  monetaryZoneId: undefined,
};

const initialState = {
  previousHubDfspMonetaryZoneId: initialHubDfspModel.monetaryZoneId,
  previousHubDfspName: initialHubDfspModel.name,
  previousHubDfspId: initialHubDfspModel.id,
  hubDfspMonetaryZoneId: initialHubDfspModel.monetaryZoneId,
  hubDfspName: initialHubDfspModel.name,
  hubDfspOverrideId: initialHubDfspModel.id,
  hubDfspDefaultId: undefined,
  isHubDfspOverrideIdSet: false,
  isHubDfspModalVisible: false,
};

const HubDfspModal = handleActions(
  {
    [RESET_HUB_DFSP_MODAL]: () => initialState,
    [SET_HUB_DFSP_MODEL]: (state, action) => {
      const model = action.payload || initialHubDfspModel;
      return {
        ...state,
        previousHubDfspMonetaryZoneId: model.monetaryZoneId,
        previousHubDfspName: model.name,
        previousHubDfspId: model.id,
        hubDfspMonetaryZoneId: model.monetaryZoneId,
        hubDfspName: model.name,
        hubDfspOverrideId: model.id,
        isHubDfspOverrideIdSet: action.payload !== undefined,
      };
    },
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
    [SET_HUB_DFSP_MODAL_MONETARY_ZONE]: (state, action) => ({
      ...state,
      hubDfspMonetaryZoneId: action.payload,
    }),
    [SHOW_HUB_DFSP_MODAL]: (state) => ({
      ...state,
      isHubDfspModalVisible: true,
    }),
    [HIDE_HUB_DFSP_MODAL]: (state) => ({
      ...state,
      isHubDfspModalVisible: false,
    }),
  },
  initialState
);

export default HubDfspModal;
export { initialState };
