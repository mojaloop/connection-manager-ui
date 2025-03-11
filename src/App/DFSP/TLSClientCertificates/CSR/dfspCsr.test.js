import prepareStore, { getStore } from 'tests/store';
import { initialState } from './reducers';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspCsr,
  setDfspCsrCertificate,
  showDfspCsrModal,
  hideDfspCsrModal,
} from './actions';

import {
  getDfspCsrCertificate,
  getIsDfspCsrModalVisible,
  getIsDfspCsrSubmitEnabled,
} from './selectors';

let store, dispatch, getState;

describe('DFSP CSR Actions & Selectors', () => {
  beforeAll(() => {
    store = getStore();
    ({ dispatch, getState } = store);
  });

  beforeEach(() => {
    dispatch(resetDfspCsr()); // Reset store before each test
  });

  it('resets the CSR reducers', () => {
    expect(getState().dfsp.tls.client.csr).toEqual(initialState);
  });

  it('sets the CSR certificate', () => {
    dispatch(setDfspCsrCertificate('CSR_CERT'));
    expect(getDfspCsrCertificate(getState())).toBe('CSR_CERT');
  });

   /*it('Should set the validations', () => {
    dispatch(setDfspCsrValidations([]));
    expect(getDfspCsrValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setDfspCsrValidationState('VALID'));
    expect(getDfspCsrValidationState(getState())).toBe('VALID');
  });*/

  it('shows the CSR modal', () => {
    dispatch(showDfspCsrModal());
    expect(getIsDfspCsrModalVisible(getState())).toBe(true);
  });

  it('hides the CSR modal', () => {
    dispatch(hideDfspCsrModal());
    expect(getIsDfspCsrModalVisible(getState())).toBe(false);
  });

  describe('Submit Button Behavior', () => {
    it('does not enable submit when certificate is not set', () => {
      dispatch(setDfspCsrCertificate(undefined));
      expect(getIsDfspCsrSubmitEnabled(getState())).toBe(false);
    });

    it('enables submit when certificate is set', () => {
      dispatch(setDfspCsrCertificate('CSR'));
      expect(getIsDfspCsrSubmitEnabled(getState())).toBe(true);
    });
  });
});
