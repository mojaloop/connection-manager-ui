/* eslint-disable no-unused-vars */
import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { apiToIpModel, ipToApiModel, apiToUrlModel, urlToApiModel } from './models';
import {
  resetDfspIngress,
  setDfspIngressIps,
  setDfspIngressIpsError,
  setDfspIngressUrls,
  setDfspIngressUrlsError,
  changeDfspIngressAddress,
  changeDfspIngressPort,
  changeDfspIngressUrl,
  addDfspIngressIp,
  removeDfspIngressIp,
  addDfspIngressPort,
  removeDfspIngressPort,
  undoDfspIngressChanges,
  storeDfspIngressIps,
  storeDfspIngressUrls,
  submitDfspIngressEndpoints,
} from './actions';

import {
  getIngressIps,
  getIngressIpsError,
  getPreviousIngressIps,
  getIngressUrls,
  getIngressUrlsError,
  getPreviousIngressUrls,
  getIsIngressChanged,
  getIpsOperations,
  getIngressIpsValidationResult,
  getIsIngressIpsValid,
  getIngressUrlsValidationResult,
  getIsIngressUrlsValid,
  getIsIngressPending,
  getIsIngressSubmitPending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';
import { initialState, initialIngressIp, initialIngressUrl } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp ingress endpoints actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetDfspIngress());
    expect(getState().dfsp.endpoints.dfsp.ingress).toEqual(initialState);
  });

  it('Should set the ips error', () => {
    dispatch(setDfspIngressIpsError('ERROR'));
    expect(getIngressIpsError(getState())).toBe('ERROR');
  });

  it('Should set the urls error', () => {
    dispatch(setDfspIngressUrlsError('ERROR'));
    expect(getIngressUrlsError(getState())).toBe('ERROR');
  });

  it('Should set the ingress ips and previous ingress ips', () => {
    dispatch(setDfspIngressIps([]));
    expect(getPreviousIngressIps(getState())).toEqual([initialIngressIp]);
    expect(getIngressIps(getState())).toEqual([initialIngressIp]);
  });

  it('Should set the ingress urls and previous ingress urls', () => {
    dispatch(setDfspIngressUrls([]));
    expect(getPreviousIngressUrls(getState())).toEqual([initialIngressUrl]);
    expect(getIngressUrls(getState())).toEqual([initialIngressUrl]);
  });

  it('Should change the ingress ip address', () => {
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.address).toBe('192.0.23.23');
  });

  it('Should change the ingress ip port', () => {
    dispatch(changeDfspIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toEqual(['8080']);
  });

  it('Should change the ingress url', () => {
    dispatch(changeDfspIngressUrl({ url: 'https://test.com', index: 0 }));
    const [url] = getIngressUrls(getState());
    expect(url.url).toBe('https://test.com');
  });

  it('Should add an ip address and port', () => {
    dispatch(addDfspIngressIp());
    expect(getIngressIps(getState())).toHaveLength(2);
  });

  it('Should add a port', () => {
    dispatch(addDfspIngressPort(0));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toHaveLength(2);
  });

  it('Should remove an ip address and port', () => {
    dispatch(addDfspIngressIp());
    dispatch(removeDfspIngressIp(1));
    expect(getIngressIps(getState())).toHaveLength(1);
  });

  it('Should remove a port', () => {
    dispatch(addDfspIngressPort(0));
    dispatch(removeDfspIngressPort({ index: 0, portIndex: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toHaveLength(1);
  });

  it('Should undo all the changes', () => {
    dispatch(addDfspIngressIp());
    dispatch(addDfspIngressIp());
    dispatch(addDfspIngressPort(0));
    dispatch(addDfspIngressPort(1));
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeDfspIngressPort({ port: '8080', index: 1, portIndex: 1 }));
    dispatch(undoDfspIngressChanges());
    expect(getIngressIps(getState())).toEqual(initialState.ingressIps);
  });
});

describe('Test the change detection', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should detect nothing changed', () => {
    dispatch(setDfspIngressIps([]));
    dispatch(setDfspIngressUrls([]));
    expect(getIsIngressChanged(getState())).toBe(false);
  });

  it('Should detect the change when adding a port', () => {
    dispatch(addDfspIngressPort(0));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when adding an ip', () => {
    dispatch(addDfspIngressIp());
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip address', () => {
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 0 }));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip port', () => {
    dispatch(changeDfspIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the url', () => {
    dispatch(changeDfspIngressUrl({ url: 'https://test.com', index: 0 }));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should get ips to create, update, delete', () => {
    const ips = [
      {
        id: 1,
        state: 'CONFIRMED',
        address: '192.168.0.1',
        ports: ['8080', '9090'],
      },
      {
        id: 2,
        state: 'CONFIRMED',
        address: '10.10.10.20',
        ports: ['11000', '12000'],
      },
      {
        id: 3,
        address: '10.10.10.99',
        ports: ['12345'],
      },
    ];
    dispatch(setDfspIngressIps(ips));
    dispatch(addDfspIngressIp());
    dispatch(changeDfspIngressPort({ port: '8080', index: 3, portIndex: 0 }));
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 3 }));
    dispatch(removeDfspIngressPort({ index: 0, portIndex: 0 }));
    dispatch(removeDfspIngressIp(2));

    const ipsOperations = getIpsOperations(getState());

    expect(ipsOperations.create).toHaveLength(1);
    expect(ipsOperations.create[0].state).toBe('UNSET');
    expect(ipsOperations.create[0].ports).toHaveLength(1);
    expect(ipsOperations.create[0].ports[0]).toBe('8080');
    expect(ipsOperations.create[0].address).toBe('192.0.23.23');

    expect(ipsOperations.update).toHaveLength(1);
    expect(ipsOperations.update[0].id).toBeDefined();
    expect(ipsOperations.update[0].ports).toHaveLength(1);
    expect(ipsOperations.update[0].ports[0]).toBe('9090');
    expect(ipsOperations.update[0].address).toBe('192.168.0.1');

    expect(ipsOperations.update).toHaveLength(1);
    expect(ipsOperations.update[0].id).toBe(1);
  });
});

describe('Test the validation', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should fail the ips validations when data is missing', () => {
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsIngressIpsValid(getState())).toBe(false);
  });

  it('Should fail the ips validations when port is missing', () => {
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsIngressIpsValid(getState())).toBe(false);
  });

  it('Should fail the ips validations when address is missing', () => {
    dispatch(changeDfspIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsIngressIpsValid(getState())).toBe(false);
  });

  it('Should pass the ips validations when all data is set', () => {
    dispatch(changeDfspIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    dispatch(changeDfspIngressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsIngressIpsValid(getState())).toBe(true);
  });

  it('Should fail the urls validations when data is missing', () => {
    const [result] = getIngressUrlsValidationResult(getState());
    expect(result.isValid).toBe(false);
    expect(getIsIngressUrlsValid(getState())).toBe(false);
  });

  it('Should pass the urls validations when all data is set', () => {
    dispatch(changeDfspIngressUrl({ url: 'https://test.com', index: 0 }));
    const [result] = getIngressUrlsValidationResult(getState());
    expect(result.isValid).toBe(true);
    expect(getIsIngressUrlsValid(getState())).toBe(true);
  });
});
