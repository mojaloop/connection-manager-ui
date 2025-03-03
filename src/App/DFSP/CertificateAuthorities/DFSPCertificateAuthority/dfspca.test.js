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
