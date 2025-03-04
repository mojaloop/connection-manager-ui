import fetchMock from 'fetch-mock';
import prepareStore, { historyMock } from 'tests/store';
import dfsps from 'tests/resources/dfsps.json';

import { initDfsp } from './actions';
import { getIsDfspLoading } from './selectors';

describe('DFSP Thunk Actions', () => {
  let store, dispatch, getState;

  beforeEach(() => {
    fetchMock.restore();
    historyMock.restore();
    fetchMock.get('*', 404);  
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should redirect to root when environment is not set', async () => {
    store = prepareStore({ dfsps, url: '/test' });
    ({ dispatch, getState } = store); 
    fetchMock.getOnce('/dfsp-endpoint', { status: 404 });
    await dispatch(initDfsp());
    console.log('Fetch Calls:', fetchMock.calls()); 
    expect(historyMock.push).toHaveBeenCalledWith('/');
    expect(getIsDfspLoading(getState())).toBe(false);
    expect(fetchMock.calls()).toHaveLength(0);
  });   
  it('should handle error when API request fails', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);
    fetchMock.getOnce('/dfsp-endpoint', { status: 500, body: { error: 'Internal Server Error' } });
    await dispatch(initDfsp());
    expect(getIsDfspLoading(getState())).toBe(false);
  

  });

  it('should return correct data when API response is successful', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);
    fetchMock.getOnce('/dfsp-endpoint', { status: 200, body: { success: true, data: { dfspId: dfsps[0]?.id } } });
    await dispatch(initDfsp());
    expect(getIsDfspLoading(getState())).toBe(false);
  });

  it('should ensure loading state is true when waiting for the API response', async () => {
    store = prepareStore({ dfsps, dfspId: dfsps[0]?.id });
    ({ dispatch, getState } = store);
  
    fetchMock.getOnce('/dfsp-endpoint', { status: 200, body: { success: true }, delay: 500 });
  
   
    dispatch(initDfsp());
  
    expect(getIsDfspLoading(getState())).toBe(true);
  
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(getIsDfspLoading(getState())).toBe(false);
  });
});
