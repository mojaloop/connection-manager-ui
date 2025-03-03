import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspJWS,
  setDfspJWSError,
  setDfspJWSIntermediateChain,
  setDfspJWSJwsCertificate,
  setDfspJWSIntermediateChainInfo,
  setDfspJWSJwsCertificateInfo,
  setDfspJWSValidations,
  setDfspJWSValidationState,
  changeDfspJWSIntermediateChain,
  changeDfspJWSJwsCertificate,
  showDfspJWSIntermediateChainModal,
  hideDfspJWSIntermediateChainModal,
  showDfspJWSJwsCertificateModal,
  hideDfspJWSJwsCertificateModal,
  storeDfspJWSCertificates,
  submitDfspJWSCertificates,
} from './actions';

import {
  getDfspJWSError,
  getDfspJWSJwsCertificate,
  getDfspJWSIntermediateChain,
  getDfspJWSJwsCertificateInfo,
  getDfspJWSIntermediateChainInfo,
  getDfspJWSValidations,
  getDfspJWSValidationState,
  getIsDfspJWSJwsCertificateModalVisible,
  getIsDfspJWSIntermediateChainModalVisible,
  getIsDfspJWSCreatePending,
  getIsDfspJWSUpdatePending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp jws certificate actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspJWS());
    expect(getState().dfsp.jws.dfsp).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspJWSError('ERROR'));
    expect(getDfspJWSError(getState())).toBe('ERROR');
  });

  it('Should set the jws certificate', () => {
    dispatch(setDfspJWSJwsCertificateInfo('JWS_CERT'));
    expect(getDfspJWSJwsCertificateInfo(getState())).toBe('JWS_CERT');
  });

  it('Should set the intermediate chain', () => {
    dispatch(setDfspJWSIntermediateChainInfo('CHAIN'));
    expect(getDfspJWSIntermediateChainInfo(getState())).toBe('CHAIN');
  });

  it('Should set the jws certificate info', () => {
    dispatch(setDfspJWSJwsCertificate('JWS_CERT_INFO'));
    expect(getDfspJWSJwsCertificate(getState())).toBe('JWS_CERT_INFO');
  });

  it('Should set the intermediate chain info', () => {
    dispatch(setDfspJWSIntermediateChain('CHAIN'));
    expect(getDfspJWSIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should set the validations', () => {
    dispatch(setDfspJWSValidations([]));
    expect(getDfspJWSValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setDfspJWSValidationState('VALID'));
    expect(getDfspJWSValidationState(getState())).toBe('VALID');
  });

  it('Should change the jws cert', () => {
    dispatch(changeDfspJWSJwsCertificate('JWS_CERT'));
    expect(getDfspJWSJwsCertificate(getState())).toBe('JWS_CERT');
  });

  it('Should change the intermediate chain', () => {
    dispatch(changeDfspJWSIntermediateChain('CHAIN'));
    expect(getDfspJWSIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should show the jws certificate modal', () => {
    dispatch(showDfspJWSJwsCertificateModal());
    expect(getIsDfspJWSJwsCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the jws certificate modal', () => {
    dispatch(hideDfspJWSJwsCertificateModal());
    expect(getIsDfspJWSJwsCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showDfspJWSIntermediateChainModal());
    expect(getIsDfspJWSIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideDfspJWSIntermediateChainModal());
    expect(getIsDfspJWSIntermediateChainModalVisible(getState())).toBe(false);
  });
});
