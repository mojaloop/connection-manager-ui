import prepareStore, { getStore, historyMock } from 'tests/store';
import { setHubLoading, unsetHubLoading, initHub } from './actions';
import { getIsHubLoading } from './selectors';

let dispatch;
let getState;

describe('Test the hub actions', () => {
  beforeAll(() => {
    const store = getStore();
    ({ dispatch, getState } = store);
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

/*
describe('Test the hub thunk actions', () => {
  let dispatch, getState;

  beforeAll(() => {
    // Restore and set up history mock
    historyMock.restore();
    historyMock.set = jest.fn();
    historyMock.push = jest.fn();

    const store = prepareStore({}); 
    ({ dispatch, getState } = store);
  });

  it('Should redirect to root when environment is not set', async () => {
    const store = prepareStore({ url: '/test', dfsps: [], dfspId: null });
    ({ dispatch, getState } = store);

    await dispatch(initHub());

    expect(historyMock.set).toHaveBeenCalledWith('/test'); 
    expect(getIsHubLoading(getState())).toBe(false);
  });

  it('Should initialize the hub app', async () => {
    await dispatch(initHub());

    expect(historyMock.push).not.toHaveBeenCalled();
    expect(getIsHubLoading(getState())).toBe(false);
  });
}); 
*/
