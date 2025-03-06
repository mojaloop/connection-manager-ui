import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { apiToIpModel, ipToApiModel } from './models';
import {
  resetHubEgress,
  setHubEgressIps,
  setHubEgressError,
  changeHubEgressAddress,
  changeHubEgressPort,
  addHubEgressIp,
  removeHubEgressIp,
  addHubEgressPort,
  removeHubEgressPort,
  undoHubEgressChanges,
  storeHubEgressIps,
  submitHubEgressIps,
} from './actions';

import {
  getEgressIps,
  getEgressError,
  getPreviousEgressIps,
  getIsEgressChanged,
  getIpsOperations,
  getEgressIpsValidationResult,
  getIsEgressIpsValid,
  getIsEgressPending,
  getIsEgressSubmitPending,
} from './selectors';

import { getIsSuccessToastVisible, getIsErrorModalVisible } from 'App/selectors';

import { initialState, initialEgressIp } from './reducers';

let dispatch;
let getState;

describe('Test the dfsp egress endpoints actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubEgress());
    expect(getState().dfsp.endpoints.dfsp.egress).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubEgressError('ERROR'));
    expect(getEgressError(getState())).toBe('ERROR');
  });

  it('Should set the egress ips and previous egress ips', () => {
    dispatch(setHubEgressIps([]));
    expect(getPreviousEgressIps(getState())).toEqual([initialEgressIp]);
    expect(getEgressIps(getState())).toEqual([initialEgressIp]);
  });

  it('Should change the egress ip address', () => {
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.address).toBe('192.0.23.23');
  });

  it('Should change the egress ip port', () => {
    dispatch(changeHubEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toEqual(['8080']);
  });

  it('Should add an ip address and port', () => {
    dispatch(addHubEgressIp());
    expect(getEgressIps(getState())).toHaveLength(2);
  });

  it('Should add a port', () => {
    dispatch(addHubEgressPort(0));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toHaveLength(2);
  });

  it('Should remove an ip address and port', () => {
    dispatch(addHubEgressIp());
    dispatch(removeHubEgressIp(1));
    expect(getEgressIps(getState())).toHaveLength(1);
  });

  it('Should remove a port', () => {
    dispatch(addHubEgressPort(0));
    dispatch(removeHubEgressPort({ index: 0, portIndex: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toHaveLength(1);
  });

  it('Should undo all the changes', () => {
    dispatch(addHubEgressIp());
    dispatch(addHubEgressIp());
    dispatch(addHubEgressPort(0));
    dispatch(addHubEgressPort(1));
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeHubEgressPort({ port: '8080', index: 1, portIndex: 1 }));
    dispatch(undoHubEgressChanges());
    expect(getEgressIps(getState())).toEqual(initialState.egressIps);
  });
});


describe('Test the change detection', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should detect nothing changed', () => {
    dispatch(setHubEgressIps([]));
    expect(getIsEgressChanged(getState())).toBe(false);
  });

  it('Should detect the change when adding a port', () => {
    dispatch(addHubEgressPort(0));
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when adding an ip', () => {
    dispatch(addHubEgressIp());
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip address', () => {
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 0 }));
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip port', () => {
    dispatch(changeHubEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    expect(getIsEgressChanged(getState())).toBe(true);
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
    dispatch(setHubEgressIps(ips));
    dispatch(addHubEgressIp());
    dispatch(changeHubEgressPort({ port: '8080', index: 3, portIndex: 0 }));
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 3 }));
    dispatch(removeHubEgressPort({ index: 0, portIndex: 0 }));
    dispatch(removeHubEgressIp(2));

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

  it('Should fail the validations when data is missing', () => {
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsEgressIpsValid(getState())).toBe(false);
  });

  it('Should fail the validations when port is missing', () => {
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsEgressIpsValid(getState())).toBe(false);
  });

  it('Should fail the validations when address is missing', () => {
    dispatch(changeHubEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsEgressIpsValid(getState())).toBe(false);
  });

  it('Should pass the validations when all data is set', () => {
    dispatch(changeHubEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    dispatch(changeHubEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsEgressIpsValid(getState())).toBe(true);
  });
});
