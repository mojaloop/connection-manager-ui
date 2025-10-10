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

describe('Test the HUB EXTERNAL CA thunk actions', () => {
  const fetchResponse = {
    rootCertificate: 'ROOT_CERT',
    intermediateChain: 'CHAIN',
    name: 'test',
    validations: [],
    validationState: 'VALID',
    type: 'EXTERNAL',
  };

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the HUB EXTERNAL CA', async () => {
    fetchMock.get('glob:*/hub/ca', fetchResponse);
    await dispatch(storeDfspHubExternalCas());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubExternalCaCertificate(getState())).not.toBe(undefined);

    const certificate = getDfspHubExternalCaCertificate(getState());
    expect(certificate.rootCertificate).toBe('ROOT_CERT');
    expect(certificate.intermediateChain).toBe('CHAIN');
    expect(certificate.name).toBe('test');
    expect(certificate.validations).toEqual([]);
    expect(certificate.validationState).toBe('VALID');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('glob:*/hub/ca', 500);
    await dispatch(storeDfspHubExternalCas());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubExternalCaError(getState()).status).toBe(500);
    expect(getDfspHubExternalCaError(getState()).error).toBeNull();
  });
});

describe('Test the api pending selectors', () => {
  const fetchResponse = {
    rootCertificate: 'ROOT_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
    type: 'EXTERNAL',
  };

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when creating', () => {
    fetchMock.get('glob:*/hub/ca', fetchResponse);
    dispatch(storeDfspHubExternalCas());
    expect(getIsDfspHubExternalCaReadPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished creating', async () => {
    fetchMock.get('glob:*/hub/ca', fetchResponse);
    await dispatch(storeDfspHubExternalCas());
    expect(getIsDfspHubExternalCaReadPending(getState())).not.toBe(true);
  });
});
