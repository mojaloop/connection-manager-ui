import { createSelector } from 'reselect';
import { getDfsps, getDfspId } from 'App/selectors';

export const getIsDfspLoading = state => state.dfsp.dfsp.isDfspLoading;

export const getOtherDfsps = createSelector(
  getDfsps,
  getDfspId,
  (dfsps, dfspId) => dfsps.filter(dfsp => dfsp.id !== dfspId)
);
