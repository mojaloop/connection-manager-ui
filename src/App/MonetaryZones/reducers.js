import { handleActions } from 'redux-actions';
import {
  SET_MONETARY_ZONES,
  SET_MONETARY_ZONES_ERROR,
  UNSET_MONETARY_ZONES,
} from './actions';

const initialState = {
  monetaryZones: [],
  monetaryZonesError: undefined,
};

const App = handleActions(
  {
    
    [SET_MONETARY_ZONES]: (state, action) => ({
      ...state,
      monetaryZones: action.payload,
    }),
    [SET_MONETARY_ZONES_ERROR]: (state, action) => ({
      ...state,
      monetaryZonesError: action.payload,
    }),
    [UNSET_MONETARY_ZONES]: (state, action) => ({
      ...state,
      monetaryZones: initialState.monetaryZones,
    }),
  },
  initialState
);

export default App;
export { initialState };
