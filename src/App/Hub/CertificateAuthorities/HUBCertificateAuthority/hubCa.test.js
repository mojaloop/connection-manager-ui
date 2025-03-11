/* eslint-disable no-unused-vars */
import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';

import {
  resetHubCa,
  setHubCaError,
  setHubCaCommonName,
  setHubCaOrganization,
  setHubCaOrganizationUnit,
  setHubCaLocality,
  setHubCaState,
  setHubCaCountry,
  changeHubCaHost,
  addHubCaHost,
  removeHubCaHost,
  setHubCa,
  setHubCaInfo,
  showHubCaModal,
  hideHubCaModal,
  storeHubCa,
  submitHubCa,
} from './actions';

import {
  getHubCaError,
  getHubCaCommonName,
  getHubCaOrganization,
  getHubCaOrganizationUnit,
  getHubCaLocality,
  getHubCaState,
  getHubCaCountry,
  getHubCaHosts,
  getHubCaRootCertificate,
  getHubCaRootCertificateInfo,
  getIsHubCaModalVisible,
  getHubCaModel,
  getIsHubCaPending,
  getHubCaModelValidationResult,
  getHubCaHostsValidationResult,
  getIsHubCaSubmitEnabled,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the hub ca actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubCa());
    expect(getState().hub.ca.hub).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubCaError('ERROR'));
    expect(getHubCaError(getState())).toBe('ERROR');
  });

  it('Should set the root cert', () => {
    dispatch(setHubCa('ROOT_CERT'));
    expect(getHubCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should set the root cert info', () => {
    dispatch(setHubCaInfo({}));
    expect(getHubCaRootCertificateInfo(getState())).toEqual({});
  });

  it('Should set the common name', () => {
    dispatch(setHubCaCommonName('TEST CN'));
    expect(getHubCaCommonName(getState())).toBe('TEST CN');
  });

  it('Should set the country', () => {
    dispatch(setHubCaCountry('TEST C'));
    expect(getHubCaCountry(getState())).toBe('TEST C');
  });

  it('Should set the organization', () => {
    dispatch(setHubCaOrganization('TEST O'));
    expect(getHubCaOrganization(getState())).toBe('TEST O');
  });

  it('Should set the organization unit', () => {
    dispatch(setHubCaOrganizationUnit('TEST OU'));
    expect(getHubCaOrganizationUnit(getState())).toBe('TEST OU');
  });

  it('Should set the locality', () => {
    dispatch(setHubCaLocality('TEST L'));
    expect(getHubCaLocality(getState())).toBe('TEST L');
  });

  it('Should set the state', () => {
    dispatch(setHubCaState('TEST S'));
    expect(getHubCaState(getState())).toBe('TEST S');
  });

  it('Should change the host', () => {
    dispatch(changeHubCaHost({ index: 0, value: 'test' }));
    expect(getHubCaHosts(getState())).toEqual(['test']);
  });

  it('Should add a host', () => {
    dispatch(addHubCaHost());
    expect(getHubCaHosts(getState())).toEqual([undefined]);
  });

  it('Should remove a host', () => {
    dispatch(addHubCaHost());
    dispatch(changeHubCaHost({ index: 0, value: 'x' }));
    dispatch(addHubCaHost());
    dispatch(changeHubCaHost({ index: 1, value: 'y' }));
    dispatch(addHubCaHost());
    dispatch(changeHubCaHost({ index: 2, value: 'z' }));
    dispatch(removeHubCaHost(1));
    expect(getHubCaHosts(getState())).toEqual(['x', 'z']);
  });

  it('Should show the root certificate modal', () => {
    dispatch(showHubCaModal());
    expect(getIsHubCaModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideHubCaModal());
    expect(getIsHubCaModalVisible(getState())).toBe(false);
  });
});


describe('Test the model and validation', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('Should fail validation when Common Name is not set', () => {
    dispatch(setHubCaCommonName(undefined));
    expect(getHubCaModelValidationResult(getState()).fields.commonName.isValid).toBe(false);
  });

  it('Should fail validation when Organization is not set', () => {
    dispatch(setHubCaOrganization(undefined));
    expect(getHubCaModelValidationResult(getState()).fields.organization.isValid).toBe(false);
  });

  it('Should pass validation when Common Name and Organization are set', () => {
    dispatch(setHubCaCommonName('CN'));
    dispatch(setHubCaOrganization('O'));
    expect(getHubCaModelValidationResult(getState()).isValid).toBe(true);
  });

  it('Should fail hosts validations when a host is invalid', () => {
    dispatch(changeHubCaHost({ index: 0, value: '/' }));
    expect(getHubCaHostsValidationResult(getState())[0].isValid).toBe(false);
  });

  it('Should pass hosts validations when a host is valid', () => {
    dispatch(changeHubCaHost({ index: 0, value: 'test' }));
    expect(getHubCaHostsValidationResult(getState())[0].isValid).toBe(true);
  });

  it('Should not enable submit when there is already a certificate', () => {
    dispatch(setHubCaCommonName('CN'));
    dispatch(setHubCaOrganization('ORG'));
    dispatch(changeHubCaHost({ index: 0, value: 'test' }));
    dispatch(setHubCa('ROOT_CERT'));
    expect(getIsHubCaSubmitEnabled(getState())).toBe(false);
  });

  it('Should allow submit when there is already a certificate', () => {
    dispatch(setHubCaCommonName('CN'));
    dispatch(setHubCaOrganization('ORG'));
    dispatch(changeHubCaHost({ index: 0, value: 'test' }));
    expect(getHubCaHostsValidationResult(getState())[0].isValid).toBe(true);
    expect(getIsHubCaSubmitEnabled(getState())).toBe(true);
  });
});
