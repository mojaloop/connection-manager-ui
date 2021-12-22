import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspHubCa,
  setDfspHubCaError,
  setDfspHubCaRootCertificate,
  showDfspHubCaRootCertificateModal,
  hideDfspHubCaRootCertificateModal,
  storeDfspHubCa,
} from './actions';

import { getDfspHubCaError, getDfspHubCaRootCertificate, getIsDfspHubCaRootCertificateModalVisible } from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp hub ca actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspHubCa());
    expect(getState().dfsp.ca.hub).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspHubCaError('ERROR'));
    expect(getDfspHubCaError(getState())).toBe('ERROR');
  });

  it('Should set the root cert', () => {
    dispatch(setDfspHubCaRootCertificate('ROOT_CERT'));
    expect(getDfspHubCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showDfspHubCaRootCertificateModal());
    expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideDfspHubCaRootCertificateModal());
    expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(false);
  });
});

describe('Test the dfsp ca thunk actions', () => {
  const fetchResponse = {
    certificate: 'ROOT_CERT',
  };

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp ca', async () => {
    fetchMock.get('end:/ca/rootCert', fetchResponse);
    await dispatch(storeDfspHubCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/ca/rootCert', 500);
    await dispatch(storeDfspHubCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubCaError(getState()).status).toBe(500);
    expect(getDfspHubCaError(getState()).error).toBe(undefined);
  });
});
