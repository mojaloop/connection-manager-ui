import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';

jest.mock('utils/api', () => ({
  hubCa: {
    read: jest.fn(),
  },
}));




import {
  resetHubExternalCa,
  setHubExternalCaError,
  setHubExternalCaRootCertificate,
  setHubExternalCaIntermediateChain,
  showHubExternalCaRootCertificateModal,
  hideHubExternalCaRootCertificateModal,
  showHubExternalCaIntermediateChainModal,
  hideHubExternalCaIntermediateChainModal,
  storeHubExternalCa,
  submitHubExternalCa,
} from './actions';

import {
  getHubExternalCaError,
  getHubExternalCaCertificate,
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


