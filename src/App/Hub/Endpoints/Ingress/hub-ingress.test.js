import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';
import environments from 'tests/resources/environments.json';

import { apiToIpModel, ipToApiModel, apiToUrlModel, urlToApiModel } from './models';
import {
  resetHubIngress,
  setHubIngressIps,
  setHubIngressIpsError,
  setHubIngressUrls,
  setHubIngressUrlsError,
  changeHubIngressAddress,
  changeHubIngressPort,
  changeHubIngressUrl,
  addHubIngressIp,
  removeHubIngressIp,
  addHubIngressPort,
  removeHubIngressPort,
  undoHubIngressChanges,
  storeHubIngressIps,
  storeHubIngressUrls,
  submitHubIngressEndpoints,
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

describe('Test the hub ingress endpoints actions', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubIngress());
    expect(getState().hub.endpoints.ingress).toEqual(initialState);
  });

  it('Should set the ips error', () => {
    dispatch(setHubIngressIpsError('ERROR'));
    expect(getIngressIpsError(getState())).toBe('ERROR');
  });

  it('Should set the urls error', () => {
    dispatch(setHubIngressUrlsError('ERROR'));
    expect(getIngressUrlsError(getState())).toBe('ERROR');
  });

  it('Should set the ingress ips and previous ingress ips', () => {
    dispatch(setHubIngressIps([]));
    expect(getPreviousIngressIps(getState())).toEqual([initialIngressIp]);
    expect(getIngressIps(getState())).toEqual([initialIngressIp]);
  });

  it('Should set the ingress urls and previous ingress urls', () => {
    dispatch(setHubIngressUrls([]));
    expect(getPreviousIngressUrls(getState())).toEqual([initialIngressUrl]);
    expect(getIngressUrls(getState())).toEqual([initialIngressUrl]);
  });

  it('Should change the ingress ip address', () => {
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.address).toBe('192.0.23.23');
  });

  it('Should change the ingress ip port', () => {
    dispatch(changeHubIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toEqual(['8080']);
  });

  it('Should change the ingress url', () => {
    dispatch(changeHubIngressUrl({ url: 'https://test.com', index: 0 }));
    const [url] = getIngressUrls(getState());
    expect(url.url).toBe('https://test.com');
  });

  it('Should add an ip address and port', () => {
    dispatch(addHubIngressIp());
    expect(getIngressIps(getState())).toHaveLength(2);
  });

  it('Should add a port', () => {
    dispatch(addHubIngressPort(0));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toHaveLength(2);
  });

  it('Should remove an ip address and port', () => {
    dispatch(addHubIngressIp());
    dispatch(removeHubIngressIp(1));
    expect(getIngressIps(getState())).toHaveLength(1);
  });

  it('Should remove a port', () => {
    dispatch(addHubIngressPort(0));
    dispatch(removeHubIngressPort({ index: 0, portIndex: 0 }));
    const [ip] = getIngressIps(getState());
    expect(ip.ports).toHaveLength(1);
  });

  it('Should undo all the changes', () => {
    dispatch(addHubIngressIp());
    dispatch(addHubIngressIp());
    dispatch(addHubIngressPort(0));
    dispatch(addHubIngressPort(1));
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeHubIngressPort({ port: '8080', index: 1, portIndex: 1 }));
    dispatch(undoHubIngressChanges());
    expect(getIngressIps(getState())).toEqual(initialState.ingressIps);
  });
});

describe('Test the hub ingress endpoints thunk actions', () => {
  const ipFetchResponse = [
    {
      id: 1,
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

  const urlFetchResponse = [
    {
      id: 1,
      state: 'CONFIRMED',
      direction: 'INGRESS',
      type: 'URL',
      created_date: '2019-05-09T11:20:08.000Z',
      created_by: null,
      value: {
        url: 'http://test.com',
      },
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should store the hub ingress ips', async () => {
    fetchMock.get('end:/ingress/ips', ipFetchResponse);
    await dispatch(storeHubIngressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIngressIps(getState())).toEqual(ipFetchResponse.map(apiToIpModel));
  });

  it('Should set the error when read operation is not successful', async () => {
    fetchMock.get('end:/ingress/ips', 500);
    await dispatch(storeHubIngressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIngressIpsError(getState()).status).toBe(500);
  });

  it('Should store the hub ingress urls', async () => {
    fetchMock.get('end:/ingress/urls', urlFetchResponse);
    await dispatch(storeHubIngressUrls());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIngressUrls(getState())).toEqual(urlFetchResponse.map(apiToUrlModel));
  });

  it('Should set the ips error when read operation is not successful', async () => {
    fetchMock.get('end:/ingress/ips', 500);
    await dispatch(storeHubIngressIps());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIngressIpsError(getState()).status).toBe(500);
  });

  it('Should set the urls error when read operation is not successful', async () => {
    fetchMock.get('end:/ingress/urls', 500);
    await dispatch(storeHubIngressUrls());
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getIngressUrlsError(getState()).status).toBe(500);
  });

  it('Should submit the endpoints', async () => {
    fetchMock.post('end:/ingress/ips', 200);
    fetchMock.put('end:/ingress/ips/*', 200);
    fetchMock.delete('end:/ingress/ips/*', 200);
    fetchMock.get('end:/ingress/ips', 200);
    fetchMock.post('end:/ingress/urls', 200);
    fetchMock.put('end:/ingress/urls/*', 200);
    fetchMock.delete('end:/ingress/urls/*', 200);
    fetchMock.get('end:/ingress/urls', 200);

    dispatch(addHubIngressIp());
    dispatch(addHubIngressIp());
    dispatch(addHubIngressPort(0));
    dispatch(addHubIngressPort(1));
    dispatch(changeHubIngressAddress({ address: '192.0.12.23', index: 0 }));
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 1 }));
    dispatch(changeHubIngressPort({ port: '90', index: 0, portIndex: 0 }));
    dispatch(changeHubIngressPort({ port: '8080', index: 0, portIndex: 1 }));
    dispatch(changeHubIngressPort({ port: '90', index: 1, portIndex: 0 }));
    dispatch(changeHubIngressPort({ port: '8080', index: 1, portIndex: 1 }));
    dispatch(changeHubIngressUrl({ url: 'https://test.com', index: 0 }));

    await dispatch(submitHubIngressEndpoints());
    expect(fetchMock.calls(MATCHED)).toHaveLength(6);

    const urls = getIngressUrls(getState());
    const ips = getIngressIps(getState());
    const [url1, call1, call2, call3] = fetchMock.calls(MATCHED);

    [url1].forEach((call, index) => {
      const url = JSON.stringify(urlToApiModel(urls[index]));
      expect(call[1].body).toEqual(url);
    });

    [call1, call2, call3].forEach((call, index) => {
      const ip = JSON.stringify(ipToApiModel(ips[index]));
      expect(call[1].body).toEqual(ip);
    });
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should set the error when create operation is not successful', async () => {
    fetchMock.post('end:/ingress/ips', 500);
    fetchMock.post('end:/ingress/urls', 500);

    dispatch(changeHubIngressAddress({ address: '192.0.12.23', index: 0 }));
    dispatch(changeHubIngressUrl({ url: 'https://test.com', index: 0 }));

    await dispatch(submitHubIngressEndpoints());
    expect(fetchMock.calls(MATCHED)).toHaveLength(2);
    expect(getIsErrorModalVisible(getState())).toBe(true);
  });
});

describe('Test the api pending selectors', () => {
  const ipFetchResponse = [
    {
      id: 1,
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

  const urlFetchResponse = [
    {
      id: 1,
      state: 'CONFIRMED',
      direction: 'INGRESS',
      type: 'URL',
      created_date: '2019-05-09T11:20:08.000Z',
      created_by: null,
      value: {
        url: 'http://test.com',
      },
    },
  ];

  beforeEach(async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id });
    ({ dispatch, getState } = store);

    fetchMock.restore();

    fetchMock.post('end:/ingress/ips', 200);
    fetchMock.put('end:/ingress/ips/*', 200);
    fetchMock.delete('end:/ingress/ips/*', 200);
    fetchMock.get('end:/ingress/ips', ipFetchResponse);

    fetchMock.post('end:/ingress/urls', 200);
    fetchMock.put('end:/ingress/urls/*', 200);
    fetchMock.delete('end:/ingress/urls/*', 200);
    fetchMock.get('end:/ingress/urls', urlFetchResponse);
  });

  it('Should detect the api is pending when reading', () => {
    dispatch(storeHubIngressIps());
    expect(getIsIngressPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished reading', async () => {
    await dispatch(submitHubIngressEndpoints());
    expect(getIsIngressSubmitPending(getState())).not.toBe(true);
  });

  it('Should detect the api is pending when submitting', () => {
    dispatch(submitHubIngressEndpoints());
    expect(getIsIngressSubmitPending(getState())).toBe(true);
  });

  it('Should detect the api is not pending when finished submitting', async () => {
    await dispatch(submitHubIngressEndpoints());
    expect(getIsIngressSubmitPending(getState())).not.toBe(true);
  });
});

describe('Test the change detection', () => {
  beforeEach(async () => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should detect nothing changed', () => {
    dispatch(setHubIngressIps([]));
    dispatch(setHubIngressUrls([]));
    expect(getIsIngressChanged(getState())).toBe(false);
  });

  it('Should detect the change when adding a port', () => {
    dispatch(addHubIngressPort(0));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when adding an ip', () => {
    dispatch(addHubIngressIp());
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip address', () => {
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 0 }));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the ip port', () => {
    dispatch(changeHubIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    expect(getIsIngressChanged(getState())).toBe(true);
  });

  it('Should detect the change when changin the url', () => {
    dispatch(changeHubIngressUrl({ url: 'https://test.com', index: 0 }));
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
    dispatch(setHubIngressIps(ips));
    dispatch(addHubIngressIp());
    dispatch(changeHubIngressPort({ port: '8080', index: 3, portIndex: 0 }));
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 3 }));
    dispatch(removeHubIngressPort({ index: 0, portIndex: 0 }));
    dispatch(removeHubIngressIp(2));

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
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 0 }));
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(true);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(false);
    });
    expect(getIsIngressIpsValid(getState())).toBe(false);
  });

  it('Should fail the ips validations when address is missing', () => {
    dispatch(changeHubIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    const [result] = getIngressIpsValidationResult(getState());
    expect(result.address.isValid).toBe(false);
    result.ports.forEach(port => {
      expect(port.isValid).toBe(true);
    });
    expect(getIsIngressIpsValid(getState())).toBe(false);
  });

  it('Should pass the ips validations when all data is set', () => {
    dispatch(changeHubIngressPort({ port: '8080', index: 0, portIndex: 0 }));
    dispatch(changeHubIngressAddress({ address: '192.0.23.23', index: 0 }));
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
    dispatch(changeHubIngressUrl({ url: 'https://test.com', index: 0 }));
    const [result] = getIngressUrlsValidationResult(getState());
    expect(result.isValid).toBe(true);
    expect(getIsIngressUrlsValid(getState())).toBe(true);
  });
});
