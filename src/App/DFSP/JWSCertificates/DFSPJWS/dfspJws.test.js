import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import environments from 'tests/resources/environments.json';
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

describe('Test the dfsp jws certificate thunk actions', () => {
  const fetchResponse = {
    jwsCertificate: 'JWS_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
  };

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp jws', async () => {
    fetchMock.get('end:/jwscerts', fetchResponse);
    await dispatch(storeDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspJWSIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspJWSValidations(getState())).toEqual([]);
    expect(getDfspJWSValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/jwscerts', 500);
    await dispatch(storeDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspJWSError(getState()).status).toBe(500);
    expect(getDfspJWSError(getState()).error).toBe(undefined);
  });

  it('Should create the dfsp server certs', async () => {
    fetchMock.post('end:/jwscerts', fetchResponse);
    await dispatch(submitDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getDfspJWSJwsCertificate(getState())).toBe('JWS_CERT');
    expect(getDfspJWSIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspJWSValidations(getState())).toEqual([]);
    expect(getDfspJWSValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/jwscerts', 500);
    await dispatch(submitDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });

  it('Should update the dfsp server certs', async () => {
    fetchMock.put('end:/jwscerts', fetchResponse);
    dispatch(setDfspJWSJwsCertificate('OLD_JWS_CERT'));
    dispatch(changeDfspJWSJwsCertificate('JWS_CERT'));
    await dispatch(submitDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getDfspJWSJwsCertificate(getState())).toBe('JWS_CERT');
    expect(getDfspJWSIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspJWSValidations(getState())).toEqual([]);
    expect(getDfspJWSValidationState(getState())).toBe('VALID');
  });

  it('Should not set the error when update operation is not successful', async () => {
    fetchMock.put('end:/jwscerts', 500);
    dispatch(setDfspJWSJwsCertificate('OLD_JWS_CERT'));
    dispatch(changeDfspJWSJwsCertificate('JWS_CERT'));
    await dispatch(submitDfspJWSCertificates());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });
});

describe('Test the api pending selectors', () => {
  const fetchResponse = {
    jwsCertificate: 'JWS_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
  };

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when creating', () => {
    fetchMock.post('end:/jwscerts', fetchResponse);
    dispatch(submitDfspJWSCertificates());
    expect(getIsDfspJWSCreatePending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished creating', async () => {
    fetchMock.post('end:/jwscerts', fetchResponse);
    await dispatch(submitDfspJWSCertificates());
    expect(getIsDfspJWSCreatePending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when updating', () => {
    fetchMock.put('end:/jwscerts', fetchResponse);
    dispatch(setDfspJWSJwsCertificate('JWS_CERT'));
    dispatch(changeDfspJWSJwsCertificate('NEW_JWS_CERT'));
    dispatch(submitDfspJWSCertificates());
    expect(getIsDfspJWSUpdatePending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished updating', async () => {
    fetchMock.put('end:/jwscerts', fetchResponse);
    dispatch(setDfspJWSJwsCertificate('JWS_CERT'));
    dispatch(changeDfspJWSJwsCertificate('NEW_JWS_CERT'));
    await dispatch(submitDfspJWSCertificates());
    expect(getIsDfspJWSUpdatePending(getState())).not.toBe(true);
  });
});
