import { createSelector } from 'reselect';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import find from 'lodash/find';
import get from 'lodash/get';
import { is422, is400, is500 } from 'utils/http';

export const getIsAppLoading = state => state.app.isAppLoading;
export const getIsSuccessToastVisible = state => state.app.isSuccessToastVisible;
export const getIsErrorModalVisible = state => state.app.isErrorModalVisible;
export const getErrorModalPayload = state => state.app.errorModalPayload;
export const getDfsps = state => state.app.dfsps;
export const getDfspsError = state => state.app.dfspsError;
export const getDfspId = state => state.app.dfspId;
export const getLoginUrl = state => state.app.config.loginUrl;
export const getLoginProvider = state => state.app.config.loginProvider;
export const checkSession = state => state.app.config.checkSession;

const getDfsp = createSelector(
  getDfsps,
  getDfspId,
  (dfsps, id) => find(dfsps, { id })
);

export const getDfspName = createSelector(
  getDfsp,
  dfsp => get(dfsp, 'name')
);

export const getDfspMonetaryZoneId = createSelector(
  getDfsp,
  dfsp => get(dfsp, 'monetaryZoneId')
);

export const getIsDfspsReadPending = createPendingSelector('dfsps.read');
export const getErrorModalContent = createSelector(
  getErrorModalPayload,
  payload => {
    if (payload === undefined) {
      return undefined;
    } else if (typeof payload === 'string') {
      return payload;
    } else if (typeof payload === 'object') {
      if (payload.hasOwnProperty('status') && payload.hasOwnProperty('data')) {
        if (is422(payload.status)) {
          return 'The was an error processing the request content';
        } else if (is400(payload.status)) {
          return get(payload.data, 'error.message');
        } else if (is500(payload.status)) {
          return 'There was an internal error. Please try again later';
        }
      }
    }
    return 'There was an error. Please try again later';
  }
);
