import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';
import { sleep } from 'utils/async';

import {
  resetHubDfspCsrs,
  setHubDfspCsrsError,
  setHubDfspCsrsCertificates,
  showHubDfspCsrsCertificateModal,
  hideHubDfspCsrsCertificateModal,
  storeHubDfspCsrs,
  submitCASignHubDfspCsr,
  submitCertificateHubDfspCsr,
} from './actions';

import {
  getHubDfspCsrsError,
  getHubDfspCsrsCertificates,
  getIsHubDfspCsrsCertificateModalVisible,
  getHubDfspCsrsCertificateModalContent,
  getHubDfspCsrsCertificateModalTitle,
  getIsHubDfspCsrsPending,
  getIsHubDfspCASigningPendingByEnrollmentId,
  getIsHubDfspCertificateSigningPending,
} from './selectors';

import { getIsSuccessToastVisible } from 'App/selectors';
import { initialState } from './reducers';

jest.mock('utils/html', () => ({
  loadFile: async () => {
    const { pem } = require('tests/resources/certificate.js');
    return pem;
  },
}));

let dispatch;
let getState;

describe('Test the hub dfsp csrs actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubDfspCsrs());
    expect(getState().hub.tls.client.dfsps).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubDfspCsrsError('ERROR'));
    expect(getHubDfspCsrsError(getState())).toBe('ERROR');
  });

  it('Should set the CSR', () => {
    dispatch(setHubDfspCsrsCertificates([]));
    expect(getHubDfspCsrsCertificates(getState())).toEqual([]);
  });

  // Uncomment and adapt tests if validations are required
  /*
  it('Should set the validations', () => {
    dispatch(setHubDfspCsrsValidations([]));
    expect(getHubDfspCsrsValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setHubDfspCsrsValidationState('VALID'));
    expect(getHubDfspCsrsValidationState(getState())).toBe('VALID');
  });
  */

  it('Should show the CSR modal', () => {
    dispatch(showHubDfspCsrsCertificateModal({ certificate: 'CERT', title: 'title' }));
    expect(getIsHubDfspCsrsCertificateModalVisible(getState())).toBe(true);
    expect(getHubDfspCsrsCertificateModalContent(getState())).toBe('CERT');
    expect(getHubDfspCsrsCertificateModalTitle(getState())).toBe('title');
  });

  it('Should hide the CSR modal', () => {
    dispatch(hideHubDfspCsrsCertificateModal());
    expect(getIsHubDfspCsrsCertificateModalVisible(getState())).toBe(false);
    expect(getHubDfspCsrsCertificateModalContent(getState())).toBe(undefined);
    expect(getHubDfspCsrsCertificateModalTitle(getState())).toBe(undefined);
  });
});
