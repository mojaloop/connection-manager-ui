import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspSentCsrs,
  setDfspSentCsrsError,
  setDfspSentCsrsFilter,
  setDfspSentCsrsCertificates,
  showDfspSentCsrsCertificateModal,
  hideDfspSentCsrsCertificateModal,
  storeDfspSentCsrs,
} from './actions';

import {
  getDfspSentCsrsError,
  getDfspSentCsrsFilter,
  getDfspSentCsrsCertificates,
  getIsDfspSentCsrsCertificateModalVisible,
  getDfspSentCsrsCertificateModalContent,
  getDfspSentCsrsCertificateModalTitle,
  getIsDfspSentCsrsPending,
  getFilteredDfspSentCsrsCertificates,
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
    dispatch(resetDfspSentCsrs());
    expect(getState().dfsp.tls.client.csrs).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspSentCsrsError('ERROR'));
    expect(getDfspSentCsrsError(getState())).toBe('ERROR');
  });

  it('Should set the CSR', () => {
    dispatch(setDfspSentCsrsCertificates([]));
    expect(getDfspSentCsrsCertificates(getState())).toEqual([]);
  });

  it('Should set the filter', () => {
    dispatch(setDfspSentCsrsFilter('TEST'));
    expect(getDfspSentCsrsFilter(getState())).toBe('TEST');
  });

  it('Should show the CSR modal', () => {
    dispatch(showDfspSentCsrsCertificateModal({ certificate: 'CERT', title: 'title' }));
    expect(getIsDfspSentCsrsCertificateModalVisible(getState())).toBe(true);
    expect(getDfspSentCsrsCertificateModalContent(getState())).toBe('CERT');
    expect(getDfspSentCsrsCertificateModalTitle(getState())).toBe('title');
  });

  it('Should hide the CSR modal', () => {
    dispatch(hideDfspSentCsrsCertificateModal());
    expect(getIsDfspSentCsrsCertificateModalVisible(getState())).toBe(false);
    expect(getDfspSentCsrsCertificateModalContent(getState())).toBe(undefined);
    expect(getDfspSentCsrsCertificateModalTitle(getState())).toBe(undefined);
  });
});
