import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspHubExternalCa,
  setDfspHubExternalCaError,
  showDfspHubExternalCaRootCertificateModal,
  hideDfspHubExternalCaRootCertificateModal,
  showDfspHubExternalCaIntermediateChainModal,
  hideDfspHubExternalCaIntermediateChainModal,
  storeDfspHubExternalCas,
} from './actions';

import {
  getDfspHubExternalCaError,
  getDfspHubExternalCaCertificate,
  getIsDfspHubExternalCaRootCertificateModalVisible,
  getIsDfspHubExternalCaIntermediateChainModalVisible,
  getIsDfspHubExternalCaReadPending,
} from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the HUB EXTERNAL CA actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspHubExternalCa());
    expect(getState().dfsp.ca.hubExternal).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspHubExternalCaError('ERROR'));
    expect(getDfspHubExternalCaError(getState())).toBe('ERROR');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showDfspHubExternalCaRootCertificateModal());
    expect(getIsDfspHubExternalCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideDfspHubExternalCaRootCertificateModal());
    expect(getIsDfspHubExternalCaRootCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showDfspHubExternalCaIntermediateChainModal());
    expect(getIsDfspHubExternalCaIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideDfspHubExternalCaIntermediateChainModal());
    expect(getIsDfspHubExternalCaIntermediateChainModalVisible(getState())).toBe(false);
  });
});

