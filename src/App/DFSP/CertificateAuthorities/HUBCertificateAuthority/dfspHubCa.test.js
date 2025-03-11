import prepareStore, { getStore } from 'tests/store';

import {
  resetDfspHubCa,
  setDfspHubCaError,
  setDfspHubCaRootCertificate,
  showDfspHubCaRootCertificateModal,
  hideDfspHubCaRootCertificateModal,
} from './actions';

import { 
  getDfspHubCaError, 
  getDfspHubCaRootCertificate, 
  getIsDfspHubCaRootCertificateModalVisible 
} from './selectors';

import { initialState } from './reducers';

let store, dispatch, getState;

describe('DFSP Hub CA Actions & Selectors', () => {
  beforeAll(() => {
    store = getStore();
    ({ dispatch, getState } = store);
  });

  beforeEach(() => {
    dispatch(resetDfspHubCa()); // Reset state before each test
  });

  describe('Reducer Reset', () => {
    it('resets the DFSP Hub CA state', () => {
      expect(getState().dfsp.ca.hub).toEqual(initialState);
    });
  });

  describe('Error Handling', () => {
    it('sets the error message', () => {
      dispatch(setDfspHubCaError('ERROR'));
      expect(getDfspHubCaError(getState())).toBe('ERROR');
    });
  });

  describe('Root Certificate Management', () => {
    it('sets the root certificate', () => {
      dispatch(setDfspHubCaRootCertificate('ROOT_CERT'));
      expect(getDfspHubCaRootCertificate(getState())).toBe('ROOT_CERT');
    });

    it('shows the root certificate modal', () => {
      dispatch(showDfspHubCaRootCertificateModal());
      expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(true);
    });

    it('hides the root certificate modal', () => {
      dispatch(hideDfspHubCaRootCertificateModal());
      expect(getIsDfspHubCaRootCertificateModalVisible(getState())).toBe(false);
    });
  });
});
