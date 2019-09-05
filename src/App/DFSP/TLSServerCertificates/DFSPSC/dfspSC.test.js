import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import environments from 'tests/resources/environments.json';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspSC,
  setDfspSCError,
  setDfspSCRootCertificate,
  setDfspSCIntermediateChain,
  setDfspSCServerCertificate,
  setDfspSCRootCertificateInfo,
  setDfspSCIntermediateChainInfo,
  setDfspSCServerCertificateInfo,
  setDfspSCValidations,
  setDfspSCValidationState,
  showDfspSCRootCertificateModal,
  changeDfspSCRootCertificate,
  changeDfspSCIntermediateChain,
  changeDfspSCServerCertificate,
  hideDfspSCRootCertificateModal,
  showDfspSCIntermediateChainModal,
  hideDfspSCIntermediateChainModal,
  showDfspSCServerCertificateModal,
  hideDfspSCServerCertificateModal,
  storeDfspSCServerCertificate,
  submitDfspSCServerCertificate,
} from './actions';

import {
  getDfspSCError,
  getDfspSCServerCertificate,
  getDfspSCRootCertificate,
  getDfspSCIntermediateChain,
  getDfspSCServerCertificateInfo,
  getDfspSCRootCertificateInfo,
  getDfspSCIntermediateChainInfo,
  getDfspSCValidations,
  getDfspSCValidationState,
  getIsDfspSCServerCertificateModalVisible,
  getIsDfspSCRootCertificateModalVisible,
  getIsDfspSCIntermediateChainModalVisible,
  getIsDfspSCReadPending,
  getIsDfspSCCreatePending,
  getIsDfspSCUpdatePending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp server certificate actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspSC());
    expect(getState().dfsp.tls.server.dfsp).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspSCError('ERROR'));
    expect(getDfspSCError(getState())).toBe('ERROR');
  });

  it('Should set the server certificate', () => {
    dispatch(setDfspSCServerCertificateInfo('SERVER_CERT'));
    expect(getDfspSCServerCertificateInfo(getState())).toBe('SERVER_CERT');
  });

  it('Should set the root certificate', () => {
    dispatch(setDfspSCRootCertificateInfo('ROOT_CERT'));
    expect(getDfspSCRootCertificateInfo(getState())).toBe('ROOT_CERT');
  });

  it('Should set the intermediate chain', () => {
    dispatch(setDfspSCIntermediateChainInfo('CHAIN'));
    expect(getDfspSCIntermediateChainInfo(getState())).toBe('CHAIN');
  });

  it('Should set the server certificate info', () => {
    dispatch(setDfspSCServerCertificate('SERVER_CERT_INFO'));
    expect(getDfspSCServerCertificate(getState())).toBe('SERVER_CERT_INFO');
  });

  it('Should set the root certificate info', () => {
    dispatch(setDfspSCRootCertificate('ROOT_CERT_INFO'));
    expect(getDfspSCRootCertificate(getState())).toBe('ROOT_CERT_INFO');
  });

  it('Should set the intermediate chain info', () => {
    dispatch(setDfspSCIntermediateChain('CHAIN'));
    expect(getDfspSCIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should set the validations', () => {
    dispatch(setDfspSCValidations([]));
    expect(getDfspSCValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setDfspSCValidationState('VALID'));
    expect(getDfspSCValidationState(getState())).toBe('VALID');
  });

  it('Should change the root cert', () => {
    dispatch(changeDfspSCServerCertificate('SERVER_CERT'));
    expect(getDfspSCServerCertificate(getState())).toBe('SERVER_CERT');
  });

  it('Should change the root cert', () => {
    dispatch(changeDfspSCRootCertificate('ROOT_CERT'));
    expect(getDfspSCRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should change the intermediate chain', () => {
    dispatch(changeDfspSCIntermediateChain('CHAIN'));
    expect(getDfspSCIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should show the server certificate modal', () => {
    dispatch(showDfspSCServerCertificateModal());
    expect(getIsDfspSCServerCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the server certificate modal', () => {
    dispatch(hideDfspSCServerCertificateModal());
    expect(getIsDfspSCServerCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the root certificate modal', () => {
    dispatch(showDfspSCRootCertificateModal());
    expect(getIsDfspSCRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideDfspSCRootCertificateModal());
    expect(getIsDfspSCRootCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showDfspSCIntermediateChainModal());
    expect(getIsDfspSCIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideDfspSCIntermediateChainModal());
    expect(getIsDfspSCIntermediateChainModalVisible(getState())).toBe(false);
  });
});

describe('Test the dfsp server certificate thunk actions', () => {
  const fetchResponse = {
    serverCertificate: 'SERVER_CERT',
    rootCertificate: 'ROOT_CERT',
    intermediateChain: 'CHAIN',
    validations: [],
    validationState: 'VALID',
  };

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp ca', async () => {
    fetchMock.get('end:/servercerts', fetchResponse);
    await dispatch(storeDfspSCServerCertificate());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspSCRootCertificate(getState())).toBe('ROOT_CERT');
    expect(getDfspSCIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspSCValidations(getState())).toEqual([]);
    expect(getDfspSCValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/servercerts', 500);
    await dispatch(storeDfspSCServerCertificate());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspSCError(getState()).status).toBe(500);
    expect(getDfspSCError(getState()).error).toBe(undefined);
  });

  it('Should create the dfsp server certs', async () => {
    fetchMock.post('end:/servercerts', fetchResponse);
    await dispatch(submitDfspSCServerCertificate());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getDfspSCServerCertificate(getState())).toBe('SERVER_CERT');
    expect(getDfspSCRootCertificate(getState())).toBe('ROOT_CERT');
    expect(getDfspSCIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspSCValidations(getState())).toEqual([]);
    expect(getDfspSCValidationState(getState())).toBe('VALID');
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/servercerts', 500);
    await dispatch(submitDfspSCServerCertificate());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });

  it('Should update the dfsp server certs', async () => {
    fetchMock.put('end:/servercerts', fetchResponse);
    dispatch(setDfspSCServerCertificate('OLD_SERVER_CERT'));
    dispatch(changeDfspSCServerCertificate('SERVER_CERT'));
    await dispatch(submitDfspSCServerCertificate());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
    expect(getDfspSCServerCertificate(getState())).toBe('SERVER_CERT');
    expect(getDfspSCRootCertificate(getState())).toBe('ROOT_CERT');
    expect(getDfspSCIntermediateChain(getState())).toBe('CHAIN');
    expect(getDfspSCValidations(getState())).toEqual([]);
    expect(getDfspSCValidationState(getState())).toBe('VALID');
  });

  it('Should not set the error when update operation is not successful', async () => {
    fetchMock.put('end:/servercerts', 500);
    dispatch(setDfspSCServerCertificate('OLD_SERVER_CERT'));
    dispatch(changeDfspSCServerCertificate('SERVER_CERT'));
    await dispatch(submitDfspSCServerCertificate());
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
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when reading', () => {
    fetchMock.get('end:/servercerts', fetchResponse);
    dispatch(storeDfspSCServerCertificate());
    expect(getIsDfspSCReadPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished reading', async () => {
    fetchMock.get('end:/servercerts', fetchResponse);
    await dispatch(storeDfspSCServerCertificate());
    expect(getIsDfspSCReadPending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when creating', () => {
    fetchMock.post('end:/servercerts', fetchResponse);
    dispatch(submitDfspSCServerCertificate());
    expect(getIsDfspSCCreatePending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished creating', async () => {
    fetchMock.post('end:/servercerts', fetchResponse);
    await dispatch(submitDfspSCServerCertificate());
    expect(getIsDfspSCCreatePending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when updating', () => {
    fetchMock.put('end:/servercerts', fetchResponse);
    dispatch(setDfspSCServerCertificate('SERVER_CERT'));
    dispatch(changeDfspSCServerCertificate('NEW_SERVER_CERT'));
    dispatch(submitDfspSCServerCertificate());
    expect(getIsDfspSCUpdatePending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished updating', async () => {
    fetchMock.put('end:/servercerts', fetchResponse);
    dispatch(setDfspSCServerCertificate('SERVER_CERT'));
    dispatch(changeDfspSCServerCertificate('NEW_SERVER_CERT'));
    await dispatch(submitDfspSCServerCertificate());
    expect(getIsDfspSCUpdatePending(getState())).not.toBe(true);
  });
});
