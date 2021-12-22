import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { apiToIpModel, ipToApiModel } from './models';
import {
  resetDfspEgress,
  setDfspEgressIps,
  setDfspEgressError,
  changeDfspEgressAddress,
  changeDfspEgressPort,
  addDfspEgressIp,
  removeDfspEgressIp,
  addDfspEgressPort,
  removeDfspEgressPort,
  undoDfspEgressChanges,
  storeDfspEgressIps,
  submitDfspEgressIps,
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
    dispatch(resetDfspEgress());
    expect(getState().dfsp.endpoints.dfsp.egress).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setDfspEgressError('ERROR'));
    expect(getEgressError(getState())).toBe('ERROR');
  });

  it('Should set the egress ips and previous egress ips', () => {
    dispatch(setDfspEgressIps([]));
    expect(getPreviousEgressIps(getState())).toEqual([initialEgressIp]);
    expect(getEgressIps(getState())).toEqual([initialEgressIp]);
  });

  it('Should change the egress ip address', () => {
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.address).toBe('192.0.23.23');
  });

  it('Should change the egress ip port', () => {
    dispatch(changeDfspEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toEqual(['8080']);
  });

  it('Should add an ip address and port', () => {
    dispatch(addDfspEgressIp());
    expect(getEgressIps(getState())).toHaveLength(2);
  });

  it('Should add a port', () => {
    dispatch(addDfspEgressPort(0));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toHaveLength(2);
  });

  it('Should remove an ip address and port', () => {
    dispatch(addDfspEgressIp());
    dispatch(removeDfspEgressIp(1));
    expect(getEgressIps(getState())).toHaveLength(1);
  });

  it('Should remove a port', () => {
    dispatch(addDfspEgressPort(0));
    dispatch(removeDfspEgressPort({ index: 0, portIndex: 0 }));
    const [ip] = getEgressIps(getState());
    expect(ip.ports).toHaveLength(1);
  });

  it('Should undo all the changes', () => {
    dispatch(addDfspEgressIp());
    dispatch(addDfspEgressIp());
    dispatch(addDfspEgressPort(0));
    dispatch(addDfspEgressPort(1));
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeDfspEgressPort({ port: '8080', index: 1, portIndex: 1 }));
    dispatch(undoDfspEgressChanges());
    expect(getEgressIps(getState())).toEqual(initialState.egressIps);
  });
});

describe('Test the dfsp egress endpoints thunk actions', () => {
  const fetchResponse = [
    {
      id: 1,
      dfsp_id: 1,
      state: 'CONFIRMED',
      direction: 'EGRESS',
      type: 'IP',
      created_date: '2019-05-09T11:18:15.000Z',
      created_by: null,
      value: {
        address: '192.168.0.1',
        ports: ['8080', '9090'],
      },
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the dfsp egress endpoints', async () => {
    fetchMock.get('end:/egress/ips', fetchResponse);
    await dispatch(storeDfspEgressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getEgressIps(getState())).toEqual(fetchResponse.map(apiToIpModel));
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/egress/ips', 500);
    await dispatch(storeDfspEgressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getEgressError(getState()).status).toBe(500);
  });

  it('Should submit the endpoints', async () => {
    fetchMock.post('end:/egress/ips', 200);
    fetchMock.put('end:/egress/ips/*', 200);
    fetchMock.delete('end:/egress/ips/*', 200);
    fetchMock.get('end:/egress/ips', 200);

    dispatch(addDfspEgressIp());
    dispatch(addDfspEgressIp());
    dispatch(addDfspEgressPort(0));
    dispatch(addDfspEgressPort(1));
    dispatch(changeDfspEgressAddress({ address: '192.0.12.23', index: 0 }));
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeDfspEgressPort({ port: '90', index: 0, portIndex: 0 }));
    dispatch(changeDfspEgressPort({ port: '8080', index: 0, portIndex: 1 }));
    dispatch(changeDfspEgressPort({ port: '90', index: 1, portIndex: 0 }));
    dispatch(changeDfspEgressPort({ port: '8080', index: 1, portIndex: 1 }));

    await dispatch(submitDfspEgressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(4);

    const ips = getEgressIps(getState());
    const [call1, call2, call3] = fetchMock.calls(MATCHED);
    [call1, call2, call3].forEach((call, index) => {
      const ip = JSON.stringify(ipToApiModel(ips[index]));
      expect(call[1].body).toEqual(ip);
    });
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/egress/ips', 500);

    dispatch(changeDfspEgressAddress({ address: '192.0.12.23', index: 0 }));

    await dispatch(submitDfspEgressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });
});

describe('Test the api pending selectors', () => {
  const fetchResponse = [
    {
      id: 1,
      dfsp_id: 1,
      state: 'CONFIRMED',
      direction: 'EGRESS',
      type: 'IP',
      created_date: '2019-05-09T11:18:15.000Z',
      created_by: null,
      value: {
        address: '192.168.0.1',
        ports: ['8080', '9090'],
      },
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();

    fetchMock.post('end:/egress/ips', 200);
    fetchMock.put('end:/egress/ips/*', 200);
    fetchMock.delete('end:/egress/ips/*', 200);
    fetchMock.get('end:/egress/ips', fetchResponse);
  });

  it('Should detect the api is pending when reading', () => {
    dispatch(storeDfspEgressIps());
    expect(getIsEgressPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished reading', async () => {
    await dispatch(submitDfspEgressIps());
    expect(getIsEgressSubmitPending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when submitting', () => {
    dispatch(submitDfspEgressIps());
    expect(getIsEgressSubmitPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished submitting', async () => {
    await dispatch(submitDfspEgressIps());
    expect(getIsEgressSubmitPending(getState())).not.toBe(true);
  });
});

describe('Test the change detection', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should detect nothing changed', () => {
    dispatch(setDfspEgressIps([]));
    expect(getIsEgressChanged(getState())).toBe(false);
  });

  it('Should detect the change when adding a port', () => {
    dispatch(addDfspEgressPort(0));
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when adding an ip', () => {
    dispatch(addDfspEgressIp());
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip address', () => {
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 0 }));
    expect(getIsEgressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip port', () => {
    dispatch(changeDfspEgressPort({ port: '8080', index: 0, portIndex: 0 }));
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
    dispatch(setDfspEgressIps(ips));
    dispatch(addDfspEgressIp());
    dispatch(changeDfspEgressPort({ port: '8080', index: 3, portIndex: 0 }));
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 3 }));
    dispatch(removeDfspEgressPort({ index: 0, portIndex: 0 }));
    dispatch(removeDfspEgressIp(2));

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
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsEgressIpsValid(getState())).toBe(false);
  });

  it('Should fail the validations when address is missing', () => {
    dispatch(changeDfspEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsEgressIpsValid(getState())).toBe(false);
  });

  it('Should pass the validations when all data is set', () => {
    dispatch(changeDfspEgressPort({ port: '8080', index: 0, portIndex: 0 }));
    dispatch(changeDfspEgressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getEgressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsEgressIpsValid(getState())).toBe(true);
  });
});
