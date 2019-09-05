import getStore, { historyMock } from './getStore';

import { setEnvironments, setEnvironmentId, setDfsps, setDfspId } from 'App/actions';

const prepareStore = ({ url, environments, environmentId, dfsps, dfspId }) => {
  // Create the store
  const store = getStore();

  if (environments) {
    store.dispatch(setEnvironments(environments));
  }

  if (environmentId) {
    store.dispatch(setEnvironmentId(environmentId));
  }

  if (dfsps) {
    store.dispatch(setDfsps(dfsps));
  }

  if (dfspId) {
    store.dispatch(setDfspId(dfspId));
  }

  if (url) {
    // when we want to test programatic route changes and redirections
    // it can be useful to set the history location to a specific url
    historyMock.set(url);
  }

  return store;
};

export default prepareStore;
