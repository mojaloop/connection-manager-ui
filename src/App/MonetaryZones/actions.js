import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';

export const SET_MONETARY_ZONES = 'Monetary Zones / Set Monetary Zones';
export const SET_MONETARY_ZONES_ERROR = 'Monetary Zones / Set Monetary Zones Error';
export const UNSET_MONETARY_ZONES = 'Monetary Zones / Unset Monetary Zones';

export const setMonetaryZones = createAction(SET_MONETARY_ZONES);
export const setMonetaryZonesError = createAction(SET_MONETARY_ZONES_ERROR);
export const unsetMonetaryZones = createAction(UNSET_MONETARY_ZONES);

export const storeMonetaryZones = environmentId => async dispatch => {
  const { data, status } = await dispatch(api.monetaryZones.read({ }));
  if (is200(status)) {
    dispatch(setMonetaryZones(data));
  } else {
    dispatch(setMonetaryZonesError(data));
  }
};
