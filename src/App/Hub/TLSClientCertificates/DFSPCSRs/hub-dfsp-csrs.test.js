import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import environments from 'tests/resources/environments.json';
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
  getFilteredHubDfspCsrsCertificatesByDFSP,
  getIsHubDfspCASigningPendingByEnrollmentId,
  getIsHubDfspCertificateSigningPending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';
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

  /*it('Should set the validations', () => {
    dispatch(setHubDfspCsrsValidations([]));
    expect(getHubDfspCsrsValidations(getState())).toEqual([]);
  });

  it('Should set the validation state', () => {
    dispatch(setHubDfspCsrsValidationState('VALID'));
    expect(getHubDfspCsrsValidationState(getState())).toBe('VALID');
  });*/

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

describe('Test the hub dfsp csrs thunk actions', () => {
  const response = [
    {
      csr: 'CSR_CERT',
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp csr', async () => {
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(storeHubDfspCsrs());
    expect(fetchMock.calls(MATCHED)).toHaveLength(dfsps.length);
    expect(getHubDfspCsrsCertificates(getState())).toHaveLength(dfsps.length);
  });

  it('Should set the error when storing fails', async () => {
    fetchMock.get('end:/enrollments/inbound', 500);
    await dispatch(storeHubDfspCsrs());
    expect(fetchMock.calls(MATCHED)).toHaveLength(dfsps.length);
    expect(getHubDfspCsrsError(getState())).toBe('Generic');
  });

  it('Should submit the CA sign on a csr', async () => {
    fetchMock.post('end:/sign', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(submitCASignHubDfspCsr(1, 1));
    expect(fetchMock.called('end:/sign')).toBe(true);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should show the error modal when the sign submit fails', async () => {
    fetchMock.post('end:/sign', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(submitCASignHubDfspCsr(1, 1));
    expect(fetchMock.called('end:/sign')).toBe(true);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should submit the certificate on a csr', async () => {
    fetchMock.post('end:/certificate', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(submitCertificateHubDfspCsr(1, 1));
    expect(fetchMock.called('end:/certificate')).toBe(true);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should show the error modal when the certificate submit fails', async () => {
    fetchMock.post('end:/certificate', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(submitCertificateHubDfspCsr(1, 1));
    expect(fetchMock.called('end:/certificate')).toBe(true);
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });
});

describe('Test the api pending selectors', () => {
  const response = [
    {
      csr: 'CSR_CERT',
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id, dfsps });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should detect the api is pending when reading', () => {
    fetchMock.get('end:/enrollments/inbound', response);
    dispatch(storeHubDfspCsrs());
    expect(getIsHubDfspCsrsPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished reading', async () => {
    fetchMock.get('end:/enrollments/inbound', response);
    await dispatch(storeHubDfspCsrs());
    expect(getIsHubDfspCsrsPending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when signin with ca', () => {
    fetchMock.post('end:/sign', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    dispatch(setHubDfspCsrsCertificates([{ id: 1, dfspId: dfsps[0].id }]));
    dispatch(submitCASignHubDfspCsr(1, 1));
    const pendingRequests = getIsHubDfspCASigningPendingByEnrollmentId(getState());
    expect(pendingRequests[1]).toBe(true);
  });

  it('Should detect the api is not pending when finished signin with ca', async () => {
    fetchMock.post('end:/sign', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    dispatch(setHubDfspCsrsCertificates([{ id: 1, dfspId: dfsps[0].id }]));
    await dispatch(submitCASignHubDfspCsr(1, 1));
    const pendingRequests = getIsHubDfspCASigningPendingByEnrollmentId(getState());
    expect(pendingRequests[1]).not.toBe(true);
  });

  it('Should detect the api is pending when signin with certificate', async () => {
    fetchMock.post('end:/certificate', sleep(10).then(200));
    fetchMock.get('end:/enrollments/inbound', response);
    dispatch(setHubDfspCsrsCertificates([{ id: 1, dfspId: dfsps[0].id }]));
    dispatch(submitCertificateHubDfspCsr(1, 1));
    await sleep(1);
    const pendingRequests = getIsHubDfspCertificateSigningPending(getState());
    expect(pendingRequests).toBe(true);
  });

  it('Should detect the api is not pending when finished signin with certificate', async () => {
    fetchMock.post('end:/certificate', 200);
    fetchMock.get('end:/enrollments/inbound', response);
    dispatch(setHubDfspCsrsCertificates([{ id: 1, dfspId: dfsps[0].id }]));
    await dispatch(submitCertificateHubDfspCsr(1, 1));
    const pendingRequests = getIsHubDfspCertificateSigningPending(getState());
    expect(pendingRequests).not.toBe(true);
  });
});
