import prepareStore, { historyMock } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { initDfsp } from './actions';
import { getIsDfspLoading } from './selectors';

describe('DFSP Thunk Actions', () => {
  let store, dispatch, getState;

  beforeEach(() => {
    jest.clearAllMocks();
    historyMock.restore();
  });

  afterEach(() => {
    if (global.fetch.mockRestore) {
      global.fetch.mockRestore();
    }
  });

  it('should redirect to root when environment is not set', async () => {
    store = prepareStore({ dfsps, url: '/test' });
    ({ dispatch, getState } = store);
    
    global.fetch = jest.fn(() => Promise.resolve({ status: 404, json: () => Promise.resolve({}) }));
    
    await dispatch(initDfsp());
    
    expect(historyMock.push).toHaveBeenCalledWith('/');
    expect(getIsDfspLoading(getState())).toBe(false);
  });

  it('should handle error when API request fails', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
      })
    );
    
    await dispatch(initDfsp());
    
    expect(getIsDfspLoading(getState())).toBe(false);
  });

  it('should return correct data when API response is successful', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ success: true, data: { dfspId: dfsps[0]?.id } }),
      })
    );
    
    await dispatch(initDfsp());
    
    expect(getIsDfspLoading(getState())).toBe(false);
  });

  it('should ensure loading state is true when waiting for the API response', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);
    
    global.fetch = jest.fn(() =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              status: 200,
              json: () => Promise.resolve({ success: true }),
            }),
          500
        )
      )
    );
    
    dispatch(initDfsp());
    expect(getIsDfspLoading(getState())).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(getIsDfspLoading(getState())).toBe(false);
  });
});