import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetHubDfspCas,
  setHubDfspCasError,
  setHubDfspCasCertificates,
  showHubDfspCasRootCertificateModal,
  hideHubDfspCasRootCertificateModal,
  storeHubDfspCas,
} from './actions';

import { 
  getHubDfspCasError, 
  getHubDfspCasCertificates, 
  getIsHubDfspCasRootCertificateModalVisible 
} from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the hub dfsps ca actions', () => {
  beforeAll(() => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubDfspCas());
    expect(getState().hub.ca.dfsps).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubDfspCasError('ERROR'));
    expect(getHubDfspCasError(getState())).toBe('ERROR');
  });

  it('Should set the root cert', () => {
    dispatch(setHubDfspCasCertificates('ROOT_CERT'));
    expect(getHubDfspCasCertificates(getState())).toBe('ROOT_CERT');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showHubDfspCasRootCertificateModal());
    expect(getIsHubDfspCasRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideHubDfspCasRootCertificateModal());
    expect(getIsHubDfspCasRootCertificateModalVisible(getState())).toBe(false);
  });
});

describe('Test the hub dfsps ca thunk actions', () => {
  let store, dispatch, getState;

  beforeAll(() => {
    store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    // Mock fetch once in beforeAll
    global.fetch = jest.fn();
  });

  it('Should set the error when read operation fails (500 error)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });

    await dispatch(storeHubDfspCas());
    expect(getHubDfspCasError(getState())).toBe('Generic');
  });
});
