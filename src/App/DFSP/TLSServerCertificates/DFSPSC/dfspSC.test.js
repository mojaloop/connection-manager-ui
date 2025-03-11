import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
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
