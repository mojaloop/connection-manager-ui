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
  storeDfspsJWSCertificates,
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

describe('Test the dfsp jws certificate actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspsJWS());
    expect(getState().dfsp.jws.dfsps).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspsJWSError('ERROR'));
    expect(getDfspsJWSError(getState())).toBe('ERROR');
  });

  it('Should set the filter', () => {
    dispatch(setDfspsJWSFilter('FILTER'));
    expect(getDfspsJWSFilter(getState())).toBe('FILTER');
  });

  it('Should set the jws certificates', () => {
    dispatch(setDfspsJWSCertificates([]));
    expect(getDfspsJWSCertificates(getState())).toEqual([]);
  });

  it('Should show the jws certificate modal', () => {
    dispatch(showDfspsJWSJwsCertificateModal('TEST'));
    expect(getIsDfspsJWSJwsCertificateModalVisible(getState())).toBe(true);
    expect(getDfspsJWSJwsCertificateModalContent(getState())).toBe('TEST');
  });

  it('Should hide the jws certificate modal', () => {
    dispatch(hideDfspsJWSJwsCertificateModal());
    expect(getIsDfspsJWSJwsCertificateModalVisible(getState())).toBe(false);
    expect(getDfspsJWSJwsCertificateModalContent(getState())).toBe(undefined);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showDfspsJWSIntermediateChainModal('TEST'));
    expect(getIsDfspsJWSIntermediateChainModalVisible(getState())).toBe(true);
    expect(getDfspsJWSIntermediateChainModalContent(getState())).toBe('TEST');
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideDfspsJWSIntermediateChainModal());
    expect(getIsDfspsJWSIntermediateChainModalVisible(getState())).toBe(false);
    expect(getDfspsJWSIntermediateChainModalContent(getState())).toBe(undefined);
  });
});


