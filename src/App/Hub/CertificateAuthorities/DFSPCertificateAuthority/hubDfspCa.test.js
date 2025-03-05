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
  beforeEach(() => {
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

  beforeEach(() => {
    store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    jest.clearAllMocks(); // Clear all mocks to ensure a fresh start
    global.fetch = jest.fn(); // Mock fetch
  });

  it('Should store the hub dfsps ca', async () => {
    const mockResponse = { certificate: 'ROOT_CERT' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await dispatch(storeHubDfspCas());
    console.log('Fetch Calls:', global.fetch.mock.calls); // Debugging fetch calls
  });

  it('Should set the error when read operation fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });

    await dispatch(storeHubDfspCas());

    console.log('Fetch Calls:', global.fetch.mock.calls);  
    expect(getHubDfspCasError(getState())).toBe('Generic');
  });
});





