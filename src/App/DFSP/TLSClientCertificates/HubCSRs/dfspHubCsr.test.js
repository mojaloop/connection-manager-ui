import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspHubCsrs,
  setDfspHubCsrsError,
  setDfspHubCsrsCertificates,
  showDfspHubCsrsCertificateModal,
  hideDfspHubCsrsCertificateModal,
  storeDfspHubCsrs,
  submitCertificateDfspHubCsr,
} from './actions';

import {
  getDfspHubCsrsError,
  getDfspHubCsrsCertificates,
  getIsDfspHubCsrsCertificateModalVisible,
  getDfspHubCsrsCertificateModalContent,
  getDfspHubCsrsCertificateModalTitle,
  getIsDfspHubCsrsPending,
  getDfspHubCsrCertificateSigningPendingCollection,
  getIsDfspHubCsrCertificateSigningPendingByEnrollmentId,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';
import { initialState } from './reducers';

// TODO: Test loading a file programmatically

let dispatch;
let getState;

describe('Test the dfsp ca actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspHubCsrs());
    expect(getState().dfsp.tls.client.hub).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspHubCsrsError('ERROR'));
    expect(getDfspHubCsrsError(getState())).toBe('ERROR');
  });

  it('Should set the CSR', () => {
    dispatch(setDfspHubCsrsCertificates([]));
    expect(getDfspHubCsrsCertificates(getState())).toEqual([]);
  });

  /*it('Should set the validations', () => {
    dispatch(setDfspHubCsrsValidations([]));
    expect(getDfspHubCsrsValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setDfspHubCsrsValidationState('VALID'));
    expect(getDfspHubCsrsValidationState(getState())).toBe('VALID');
  });*/

  it('Should show the CSR modal', () => {
    dispatch(showDfspHubCsrsCertificateModal({ certificate: 'CERT', title: 'title' }));
    expect(getIsDfspHubCsrsCertificateModalVisible(getState())).toBe(true);
    expect(getDfspHubCsrsCertificateModalContent(getState())).toBe('CERT');
    expect(getDfspHubCsrsCertificateModalTitle(getState())).toBe('title');
  });

  it('Should hide the CSR modal', () => {
    dispatch(hideDfspHubCsrsCertificateModal());
    expect(getIsDfspHubCsrsCertificateModalVisible(getState())).toBe(false);
    expect(getDfspHubCsrsCertificateModalContent(getState())).toBe(undefined);
    expect(getDfspHubCsrsCertificateModalTitle(getState())).toBe(undefined);
  });
});

describe('Test the dfsp csr thunk actions', () => {
  const response = [
    {
      csr: 'CSR_CERT',
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should submit the dfsp csr', async () => {
    fetchMock.get('end:/enrollments/outbound', response);
    await dispatch(storeDfspHubCsrs());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubCsrsCertificates(getState())).toEqual(response);
  });

  it('Should show the error modal when the submit fails', async () => {
    fetchMock.get('end:/enrollments/outbound', 500);
    await dispatch(storeDfspHubCsrs());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfspHubCsrsError(getState())).toBe('Generic');
  });

  /*it('Should submit the dfsp csr', async () => {
    fetchMock.post('end:/enrollments/inbound', response);
    fetchMock.get('end:/enrollments/inbound', 200);
    await dispatch(submitCertificateDfspHubCsr());
    expect(fetchMock.calls(MATCHED)).toHaveLength(2);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should show the error modal when the submit fails', async () => {
    fetchMock.post('end:/enrollments/inbound', 500);
    await dispatch(submitCertificateDfspHubCsr());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });*/
});

describe('Test the api pending selectors', () => {
  const response = [
    {
      csr: 'CSR_CERT',
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when reading', () => {
    fetchMock.get('end:/enrollments/outbound', response);
    dispatch(storeDfspHubCsrs());
    expect(getIsDfspHubCsrsPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished reading', async () => {
    fetchMock.get('end:/enrollments/outbound', response);
    await dispatch(storeDfspHubCsrs());
    expect(getIsDfspHubCsrsPending(getState())).not.toBe(true);
  });
});
