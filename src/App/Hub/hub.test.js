import { fetchMock } from 'fetch-mock';
import prepareStore, { getStore, historyMock } from 'tests/store';
import environments from 'tests/resources/environments.json';

import { setHubLoading, unsetHubLoading, initHub } from './actions';

import { getIsHubLoading } from './selectors';

let dispatch;
let getState;

describe('Test the hub actions', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    fetchMock.restore();
  });

  it('Should set the hub loading', () => {
    dispatch(setHubLoading());
    expect(getIsHubLoading(getState())).toBe(true);
  });

  it('Should unset the hub loading', () => {
    dispatch(unsetHubLoading());
    expect(getIsHubLoading(getState())).toBe(false);
  });
});

describe('Test the hub thunk actions', () => {
  beforeEach(() => {
    historyMock.restore();
    fetchMock.restore();
    fetchMock.get('*', 404);
  });

  it('Should redirect to root when environment is not set', async () => {
    const store = prepareStore({ environments, url: '/test' });
    ({ dispatch, getState } = store);
    await dispatch(initHub());
    expect(historyMock.push).toHaveBeenCalledWith('/');
    expect(getIsHubLoading(getState())).toBe(false);
    expect(fetchMock.calls()).toHaveLength(0);
  });

  it('Should initialize the hub app', async () => {
    const store = prepareStore({ environments, environmentId: environments[0].id });
    ({ dispatch, getState } = store);
    await dispatch(initHub());
    expect(historyMock.push).not.toHaveBeenCalled();
    expect(fetchMock.calls()).not.toHaveLength(0);
    expect(getIsHubLoading(getState())).toBe(false);
  });
});
