import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import {
  resetDfspsJWS,
  setDfspsJWSError,
  setDfspsJWSFilter,
  setDfspsJWSCertificates,
  showDfspsJWSIntermediateChainModal,
  hideDfspsJWSIntermediateChainModal,
  showDfspsJWSJwsCertificateModal,
  hideDfspsJWSJwsCertificateModal,
} from './actions';

import {
  getDfspsJWSError,
  getDfspsJWSFilter,
  getDfspsJWSCertificates,
  getDfspsJWSJwsCertificateModalContent,
  getDfspsJWSIntermediateChainModalContent,
  getIsDfspsJWSJwsCertificateModalVisible,
  getIsDfspsJWSIntermediateChainModalVisible,
} from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp JWS certificate actions', () => {
  beforeAll(() => {
    const store = getStore();
    dispatch = store.dispatch;
    getState = store.getState;
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspsJWS());
    expect(getState().dfsp.jws.dfsps).toEqual(initialState);
  });

  it('Should set and retrieve the error state', () => {
    dispatch(setDfspsJWSError('ERROR'));
    expect(getDfspsJWSError(getState())).toBe('ERROR');
  });

  it('Should set and retrieve the filter', () => {
    dispatch(setDfspsJWSFilter('FILTER'));
    expect(getDfspsJWSFilter(getState())).toBe('FILTER');
  });

  it('Should set and retrieve JWS certificates', () => {
    const testCertificates = [{ id: 1, cert: 'test-cert' }];
    dispatch(setDfspsJWSCertificates(testCertificates));
    expect(getDfspsJWSCertificates(getState())).toEqual(testCertificates);
  });

  it('Should toggle the JWS certificate modal', () => {
    dispatch(showDfspsJWSJwsCertificateModal('TEST'));
    let state = getState();
    expect(getIsDfspsJWSJwsCertificateModalVisible(state)).toBe(true);
    expect(getDfspsJWSJwsCertificateModalContent(state)).toBe('TEST');

    dispatch(hideDfspsJWSJwsCertificateModal());
    state = getState();
    expect(getIsDfspsJWSJwsCertificateModalVisible(state)).toBe(false);
    expect(getDfspsJWSJwsCertificateModalContent(state)).toBeUndefined();
  });

  it('Should toggle the intermediate chain modal', () => {
    dispatch(showDfspsJWSIntermediateChainModal('TEST'));
    let state = getState();
    expect(getIsDfspsJWSIntermediateChainModalVisible(state)).toBe(true);
    expect(getDfspsJWSIntermediateChainModalContent(state)).toBe('TEST');

    dispatch(hideDfspsJWSIntermediateChainModal());
    state = getState();
    expect(getIsDfspsJWSIntermediateChainModalVisible(state)).toBe(false);
    expect(getDfspsJWSIntermediateChainModalContent(state)).toBeUndefined();
  });
});
