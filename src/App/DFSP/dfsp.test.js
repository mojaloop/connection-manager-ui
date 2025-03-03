import { fetchMock } from 'fetch-mock';
import prepareStore, { getStore, historyMock } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { setDfspLoading, unsetDfspLoading, initDfsp } from './actions';

import { getIsDfspLoading } from './selectors';

let dispatch;
let getState;


describe('Test the dfsp thunk actions', () => {
  beforeEach(() => {
    historyMock.restore();
    fetchMock.restore();
    fetchMock.get('*', 404);
  });

  it('Should redirect to root when environment is not set', async () => {
    const store = prepareStore({ dfsps, url: '/test' });
    ({ dispatch, getState } = store);
    await dispatch(initDfsp());
    expect(historyMock.push).toHaveBeenCalledWith('/');
    expect(getIsDfspLoading(getState())).toBe(false);
    expect(fetchMock.calls()).toHaveLength(0);
  });

  it('Should initialize the DFSP app', async () => {
    const store = prepareStore({ dfsps, dfspId: dfsps[0].id });
    ({ dispatch, getState } = store);
    await dispatch(initDfsp());
    expect(historyMock.push).not.toHaveBeenCalled();
    expect(fetchMock.calls()).not.toHaveLength(0);
    expect(getIsDfspLoading(getState())).toBe(false);
  });
});
