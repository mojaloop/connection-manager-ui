/* eslint-disable no-unused-vars */
import prepareStore, { getStore } from 'tests/store';
import { fetchMock } from 'fetch-mock';

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
} from './actions';

import {
  getDfspCaError,
  getDfspCaRootCertificate,
  getDfspCaIntermediateChain,
  getDfspCaValidations,
  getDfspCaValidationState,
  getIsDfspCaRootCertificateModalVisible,
  getIsDfspCaIntermediateChainModalVisible,
} from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp ca actions', () => {
  beforeEach(() => {
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

  /* Example of testing an API call action
  it('Should fetch and handle DFSP CA validations', async () => {
    // Mocking the API response
    const mockApiResponse = { success: true, validations: [] };
    fetchMock.mock('https://api.example.com/dfsp-ca-validations', {
      body: mockApiResponse,
      status: 200,
    });

    // Action that triggers the API call
    await dispatch(setDfspCaValidations());

    // Verifying the API call was made
    expect(fetchMock.calls().length).toBe(1);

    // Optionally, assert that the state has been updated based on the mock response
    expect(getDfspCaValidations(getState())).toEqual(mockApiResponse.validations);
  });
  */

});
