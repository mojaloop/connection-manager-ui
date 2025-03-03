import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';

import {
  resetDfspHubCa,
  setDfspHubCaError,
  setDfspHubCaRootCertificate,
  showDfspHubCaRootCertificateModal,
  hideDfspHubCaRootCertificateModal,
  storeDfspHubCa,
} from './actions';

import { getDfspHubCaError, getDfspHubCaRootCertificate, getIsDfspHubCaRootCertificateModalVisible } from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp hub ca actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspHubCa());
    expect(getState().dfsp.ca.hub).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspHubCaError('ERROR'));
    expect(getDfspHubCaError(getState())).toBe('ERROR');
  });

  it('Should set the root cert', () => {
    dispatch(setDfspHubCaRootCertificate('ROOT_CERT'));
    expect(getDfspHubCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showDfspHubCaRootCertificateModal());
    expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideDfspHubCaRootCertificateModal());
    expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(false);
  });
});

