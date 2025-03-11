import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspHubExternalCa,
  setDfspHubExternalCaError,
  showDfspHubExternalCaRootCertificateModal,
  hideDfspHubExternalCaRootCertificateModal,
  showDfspHubExternalCaIntermediateChainModal,
  hideDfspHubExternalCaIntermediateChainModal,
} from './actions';

import {
  getDfspHubExternalCaError,
  getIsDfspHubExternalCaRootCertificateModalVisible,
  getIsDfspHubExternalCaIntermediateChainModalVisible,
} from './selectors';

import { initialState } from './reducers';

let store, dispatch, getState;

describe('HUB EXTERNAL CA Actions & Selectors', () => {
  beforeAll(() => {
    store = getStore();
    ({ dispatch, getState } = store);
  });

  beforeEach(() => {
    // Reset state before each test
    dispatch(resetDfspHubExternalCa());

    // Mock fetch API
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue(dfsps),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Ensures fetch and other mocks are cleaned up
  });

  describe('Reducer Reset', () => {
    it('resets the HUB EXTERNAL CA state', () => {
      expect(getState().dfsp.ca.hubExternal).toEqual(initialState);
    });
  });

  describe('Error Handling', () => {
    it('sets the error message', () => {
      dispatch(setDfspHubExternalCaError('ERROR'));
      expect(getDfspHubExternalCaError(getState())).toBe('ERROR');
    });
  });

  describe('Modals', () => {
    it('shows the root certificate modal', () => {
      dispatch(showDfspHubExternalCaRootCertificateModal());
      expect(getIsDfspHubExternalCaRootCertificateModalVisible(getState())).toBe(true);
    });

    it('hides the root certificate modal', () => {
      dispatch(hideDfspHubExternalCaRootCertificateModal());
      expect(getIsDfspHubExternalCaRootCertificateModalVisible(getState())).toBe(false);
    });

    it('shows the intermediate chain modal', () => {
      dispatch(showDfspHubExternalCaIntermediateChainModal());
      expect(getIsDfspHubExternalCaIntermediateChainModalVisible(getState())).toBe(true);
    });

    it('hides the intermediate chain modal', () => {
      dispatch(hideDfspHubExternalCaIntermediateChainModal());
      expect(getIsDfspHubExternalCaIntermediateChainModalVisible(getState())).toBe(false);
    });
  });
});
