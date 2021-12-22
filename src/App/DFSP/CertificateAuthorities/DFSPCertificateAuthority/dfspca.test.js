import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspCa,
  setDfspCaError,
  setDfspCaRootCert,
  setDfspCaIntermediateChain,
  setDfspCaValidations,
  setDfspCaValidationState,
  changeDfspCaRootCert,
  changeDfspCaIntermediateChain,
  showDfspCaRootCertificateModal,
  hideDfspCaRootCertificateModal,
  showDfspCaIntermediateChainModal,
  hideDfspCaIntermediateChainModal,
  storeDfspCa,
  submitDfspCa,
  changeDfspCaRootCertificateAndSubmit,
  changeDfspCaIntermediateChainAndSubmit,
} from './actions';

import {
  getDfspCaError,
  getDfspCaRootCertificate,
  getDfspCaIntermediateChain,
  getDfspCaValidations,
  getDfspCaValidationState,
  getIsDfspCaRootCertificateModalVisible,
  getIsDfspCaIntermediateChainModalVisible,
  getIsDfspCaPending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp ca actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspCa());
    expect(getState().dfsp.ca.dfsp).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspCaError('ERROR'));
    expect(getDfspCaError(getState())).toBe('ERROR');
  });

  it('Should set the root cert', () => {
    dispatch(setDfspCaRootCert('ROOT_CERT'));
    expect(getDfspCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should set the intermediate chain', () => {
    dispatch(setDfspCaIntermediateChain('CHAIN'));
    expect(getDfspCaIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should set the validations', () => {
    dispatch(setDfspCaValidations([]));
    expect(getDfspCaValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setDfspCaValidationState('VALID'));
    expect(getDfspCaValidationState(getState())).toBe('VALID');
  });

  it('Should change the root cert', () => {
    dispatch(changeDfspCaRootCert('ROOT_CERT'));
    expect(getDfspCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should change the intermediate chain', () => {
    dispatch(changeDfspCaIntermediateChain('CHAIN'));
    expect(getDfspCaIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showDfspCaRootCertificateModal());
    expect(getIsDfspCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideDfspCaRootCertificateModal());
    expect(getIsDfspCaRootCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showDfspCaIntermediateChainModal());
    expect(getIsDfspCaIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideDfspCaIntermediateChainModal());
    expect(getIsDfspCaIntermediateChainModalVisible(getState())).toBe(false);
  });
});

describe('Test the dfsp ca thunk actions', () => {
  const fetchResponse = {
    rootCertificate: 'ROOT_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
  };

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp ca', async () => {
    fetchMock.get('end:/ca', fetchResponse);
    await dispatch(storeDfspCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspCaRootCertificate(getState())).toBe('ROOT_CERT');
    expect(getDfspCaIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspCaValidations(getState())).toEqual([]);
    expect(getDfspCaValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/ca', 500);
    await dispatch(storeDfspCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspCaError(getState()).status).toBe(500);
    expect(getDfspCaError(getState()).error).toBe(undefined);
  });

  it('Should submit the dfsp ca', async () => {
    fetchMock.post('end:/ca', fetchResponse);
    await dispatch(submitDfspCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getDfspCaRootCertificate(getState())).toBe('ROOT_CERT');
    expect(getDfspCaIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspCaValidations(getState())).toEqual([]);
    expect(getDfspCaValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/ca', 500);
    await dispatch(submitDfspCa());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });

  it('Should change the root cert and submit', async () => {
    fetchMock.post('end:/ca', fetchResponse);
    await dispatch(changeDfspCaRootCertificateAndSubmit('ROOT_CERT'));
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should change the intermediate chain and submit', async () => {
    fetchMock.post('end:/ca', fetchResponse);
    await dispatch(changeDfspCaIntermediateChainAndSubmit('CHAIN'));
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspCaIntermediateChain(getState())).toBe('CHAIN');
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
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when creating', () => {
    fetchMock.post('end:/ca', fetchResponse);
    dispatch(submitDfspCa());
    expect(getIsDfspCaPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished creating', async () => {
    fetchMock.post('end:/ca', fetchResponse);
    await dispatch(submitDfspCa());
    expect(getIsDfspCaPending(getState())).not.toBe(true);
  });
});
