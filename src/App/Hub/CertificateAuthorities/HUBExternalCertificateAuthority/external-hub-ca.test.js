import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import environments from 'tests/resources/environments.json';

import {
  resetHubExternalCa,
  setHubExternalCaError,
  setHubExternalCaRootCertificate,
  setHubExternalCaIntermediateChain,
  showHubExternalCaRootCertificateModal,
  hideHubExternalCaRootCertificateModal,
  showHubExternalCaIntermediateChainModal,
  hideHubExternalCaIntermediateChainModal,
  storeHubExternalCas,
  submitHubExternalCa,
} from './actions';

import {
  getHubExternalCaError,
  getHubExternalCaCertificates,
  getHubExternalCaRootCertificate,
  getHubExternalCaIntermediateChain,
  getHubExternalCaName,
  getIsHubExternalCaRootCertificateModalVisible,
  getIsHubExternalCaIntermediateChainModalVisible,
  getIsHubExternalCaCreatePending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the HUB EXTERNAL CA actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubExternalCa());
    expect(getState().hub.ca.external).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubExternalCaError('ERROR'));
    expect(getHubExternalCaError(getState())).toBe('ERROR');
  });

  it('Should change the root certificate', () => {
    dispatch(setHubExternalCaRootCertificate('ROOT_CERT'));
    expect(getHubExternalCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should change the intermediate chain', () => {
    dispatch(setHubExternalCaIntermediateChain('CHAIN'));
    expect(getHubExternalCaIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showHubExternalCaRootCertificateModal());
    expect(getIsHubExternalCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideHubExternalCaRootCertificateModal());
    expect(getIsHubExternalCaRootCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showHubExternalCaIntermediateChainModal());
    expect(getIsHubExternalCaIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideHubExternalCaIntermediateChainModal());
    expect(getIsHubExternalCaIntermediateChainModalVisible(getState())).toBe(false);
  });
});

describe('Test the HUB EXTERNAL CA thunk actions', () => {
  const fetchResponse = [
    {
      rootCertificate: 'ROOT_CERT',
      intermediateChain: 'CHAIN',
      name: 'test',
      validations: [],
      validationState: 'VALID',
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the HUB EXTERNAL CA', async () => {
    fetchMock.get('end:/cas', fetchResponse);
    await dispatch(storeHubExternalCas());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getHubExternalCaCertificates(getState())).toHaveLength(1);

    const [certificate] = getHubExternalCaCertificates(getState());
    expect(certificate.rootCertificate).toBe('ROOT_CERT');
    expect(certificate.intermediateChain).toBe('CHAIN');
    expect(certificate.name).toBe('test');
    expect(certificate.validations).toEqual([]);
    expect(certificate.validationState).toBe('VALID');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/cas', 500);
    await dispatch(storeHubExternalCas());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getHubExternalCaError(getState()).status).toBe(500);
    expect(getHubExternalCaError(getState()).error).toBe(undefined);
  });

  it('Should submit the HUB EXTERNAL CA', async () => {
    fetchMock.post('end:/cas', fetchResponse);
    fetchMock.get('end:/cas', []);
    await dispatch(submitHubExternalCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(2);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getHubExternalCaRootCertificate(getState())).toBe(undefined);
    expect(getHubExternalCaIntermediateChain(getState())).toBe(undefined);
    expect(getHubExternalCaName(getState())).toBe(undefined);
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/cas', 500);
    await dispatch(submitHubExternalCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });
});

describe('Test the api pending selectors', () => {
  const fetchResponse = {
    rootCertificate: 'ROOT_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
  };

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when creating', () => {
    fetchMock.post('end:/cas', fetchResponse);
    fetchMock.get('end:/cas', []);
    dispatch(submitHubExternalCa());
    expect(getIsHubExternalCaCreatePending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished creating', async () => {
    fetchMock.post('end:/cas', fetchResponse);
    fetchMock.get('end:/cas', []);
    await dispatch(submitHubExternalCa());
    expect(getIsHubExternalCaCreatePending(getState())).not.toBe(true);
  });
});
