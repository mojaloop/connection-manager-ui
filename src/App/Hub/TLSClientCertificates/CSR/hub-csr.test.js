import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';
import {
  resetHubCsr,
  setHubCsrDfspId,
  setHubCsrCertificate,
  setHubCsrCsrType,
  setHubCsrCommonName,
  setHubCsrOrganization,
  setHubCsrOrganizationUnit,
  setHubCsrEmail,
  setHubCsrLocality,
  setHubCsrCountry,
  setHubCsrState,
  changeHubCsrDns,
  addHubCsrDns,
  removeHubCsrDns,
  changeHubCsrIp,
  addHubCsrIp,
  removeHubCsrIp,
  showHubCsrModal,
  hideHubCsrModal,
  submitHubCsr,
} from './actions';

import {
  getHubCsrDfspId,
  getHubCsrCertificate,
  getHubCsrCsrType,
  getHubCsrCommonName,
  getHubCsrOrganization,
  getHubCsrOrganizationUnit,
  getHubCsrEmail,
  getHubCsrLocality,
  getHubCsrCountry,
  getHubCsrState,
  getHubCsrDnss,
  getHubCsrIps,
  getIsHubCsrModalVisible,
  getIsHubCsrSubmitPending,
  getIsHubCsrSubmitEnabled,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';
import { CSR_TYPES } from './constants';

let dispatch;
let getState;

describe('Test the hub csr actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubCsr());
    expect(getState().hub.tls.client.csr).toEqual(initialState);
  });

  it('Should set the CSR', () => {
    dispatch(setHubCsrCertificate('CSR_CERT'));
    expect(getHubCsrCertificate(getState())).toBe('CSR_CERT');
  });

  it('Should set the dfsp Id', () => {
    dispatch(setHubCsrDfspId(1));
    expect(getHubCsrDfspId(getState())).toBe(1);
  });

  it('Should set the CSR Type', () => {
    dispatch(setHubCsrCsrType('Type'));
    expect(getHubCsrCsrType(getState())).toBe('Type');
  });

  it('Should set the CSR CommonName', () => {
    dispatch(setHubCsrCommonName('CN'));
    expect(getHubCsrCommonName(getState())).toBe('CN');
  });

  it('Should set the CSR Organization', () => {
    dispatch(setHubCsrOrganization('O'));
    expect(getHubCsrOrganization(getState())).toBe('O');
  });

  it('Should set the CSR OrganizationUnit', () => {
    dispatch(setHubCsrOrganizationUnit('OU'));
    expect(getHubCsrOrganizationUnit(getState())).toBe('OU');
  });

  it('Should set the CSR Email', () => {
    dispatch(setHubCsrEmail('email.com'));
    expect(getHubCsrEmail(getState())).toBe('email.com');
  });

  it('Should set the CSR Locality', () => {
    dispatch(setHubCsrLocality('Locality'));
    expect(getHubCsrLocality(getState())).toBe('Locality');
  });

  it('Should set the CSR Country', () => {
    dispatch(setHubCsrCountry('Country'));
    expect(getHubCsrCountry(getState())).toBe('Country');
  });

  it('Should set the CSR State', () => {
    dispatch(setHubCsrState('State'));
    expect(getHubCsrState(getState())).toBe('State');
  });

  it('Should change a Csr Dns', () => {
    dispatch(changeHubCsrDns({ index: 0, value: 'mydomain.com' }));
    expect(getHubCsrDnss(getState())).toEqual(['mydomain.com']);
  });
  it('Should add a Csr Dns', () => {
    dispatch(addHubCsrDns());
    expect(getHubCsrDnss(getState())).toHaveLength(1);
    expect(getHubCsrDnss(getState())).toEqual([undefined]);
  });
  it('Should remove a Csr Dns', () => {
    dispatch(addHubCsrDns());
    dispatch(addHubCsrDns());
    dispatch(addHubCsrDns());
    dispatch(removeHubCsrDns(1));
    expect(getHubCsrDnss(getState())).toHaveLength(2);
    expect(getHubCsrDnss(getState())).toEqual([undefined, undefined]);
  });
  it('Should change a Csr Ip', () => {
    dispatch(changeHubCsrIp({ index: 0, value: '123.3.3.32' }));
    expect(getHubCsrIps(getState())).toEqual(['123.3.3.32']);
  });
  it('Should add a Csr Ip', () => {
    dispatch(addHubCsrIp());
    expect(getHubCsrIps(getState())).toHaveLength(1);
    expect(getHubCsrIps(getState())).toEqual([undefined]);
  });
  it('Should remove a Csr Ip', () => {
    dispatch(addHubCsrIp());
    dispatch(addHubCsrIp());
    dispatch(addHubCsrIp());
    dispatch(removeHubCsrIp(1));
    expect(getHubCsrIps(getState())).toHaveLength(2);
    expect(getHubCsrIps(getState())).toEqual([undefined, undefined]);
  });

  it('Should show the CSR modal', () => {
    dispatch(showHubCsrModal());
    expect(getIsHubCsrModalVisible(getState())).toBe(true);
  });

  it('Should hide the CSR modal', () => {
    dispatch(hideHubCsrModal());
    expect(getIsHubCsrModalVisible(getState())).toBe(false);
  });
});

describe('Test the submit selectors', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should not enable the submit button when certificate is not set', () => {
    dispatch(setHubCsrCertificate(undefined));
    expect(getIsHubCsrSubmitEnabled(getState())).toBe(false);
  });

  it('Should not enable the submit button when dfsp is not ', () => {
    dispatch(setHubCsrDfspId(undefined));
    expect(getIsHubCsrSubmitEnabled(getState())).toBe(false);
  });

  it('Should enable the submit button when dfsp and certificate are set', () => {
    dispatch(setHubCsrDfspId(1));
    dispatch(setHubCsrCertificate('CSR'));
    expect(getIsHubCsrSubmitEnabled(getState())).toBe(true);
  });

  it('Should not enable the submit button when type is manual and form is empty', () => {
    dispatch(setHubCsrDfspId(1));
    dispatch(setHubCsrCsrType(CSR_TYPES.MANUAL));
    expect(getIsHubCsrSubmitEnabled(getState())).toBe(false);
  });

  it('Should enable the submit button when type is manual and form and dfsp are set', () => {
    dispatch(setHubCsrDfspId(1));
    dispatch(setHubCsrCsrType(CSR_TYPES.MANUAL));
    dispatch(setHubCsrCommonName('CommonName'));
    dispatch(setHubCsrOrganization('Organization'));
    dispatch(setHubCsrOrganizationUnit('OrganizationUnit'));
    dispatch(setHubCsrEmail('test@test.com'));
    dispatch(setHubCsrLocality('Locality'));
    dispatch(setHubCsrCountry('Country'));
    dispatch(setHubCsrState('State'));
    expect(getIsHubCsrSubmitEnabled(getState())).toBe(true);
  });
});
