import { getStore } from 'tests/store';

import {
  setAppLoading,
  unsetAppLoading,
  showToast,
  hideToast,
  showErrorModal,
  hideErrorModal,
  setDfsps,
  setDfspsError,
  setDfspId,
  storeDFSPs,
  initApp,
  showSuccessToast,
} from './actions';

import {
  getIsAppLoading,
  getIsSuccessToastVisible,
  getIsErrorModalVisible,
  getErrorModalContent,
  getDfsps,
  getDfspsError,
  getDfspId,
  getDfspName,
  getIsDfspsReadPending,
} from './selectors';

const dfspItems = [
  {
    id: 'MTN CI',
    envId: 1,
    name: 'MTN CI',
    securityGroup: 'Application/DFSP:MTN CI',
  },
  {
    id: 'Orange CI',
    envId: 1,
    name: 'Orange CI',
    securityGroup: 'Application/DFSP:Orange CI',
  },
];

let dispatch;
let getState;

describe('Test the app actions', () => {
  let dispatch, getState;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(); // Mock the fetch API
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should set the app loading', () => {
    dispatch(setAppLoading());
    expect(getIsAppLoading(getState())).toBe(true);
  });

  it('Should unset the app loading', () => {
    dispatch(unsetAppLoading());
    expect(getIsAppLoading(getState())).toBe(false);
  });

  it('Should show the toast', () => {
    dispatch(showToast());
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should hide the toast', () => {
    dispatch(hideToast());
    expect(getIsSuccessToastVisible(getState())).toBe(false);
  });

  it('Should show the error modal', () => {
    dispatch(showErrorModal('ERROR'));
    expect(getIsErrorModalVisible(getState())).toBe(true);
    expect(getErrorModalContent(getState())).toBe('ERROR');
  });

  it('Should hide the error modal', () => {
    dispatch(hideErrorModal());
    expect(getIsErrorModalVisible(getState())).toBe(false);
    expect(getErrorModalContent(getState())).toBeUndefined();
  });

  it('Should set the dfsps', () => {
    dispatch(setDfsps(dfspItems));
    const dfsps = getDfsps(getState());
    expect(dfsps).toHaveLength(dfspItems.length);
    expect(dfsps).toEqual(dfspItems);
  });

  it('Should set the dfsps error', () => {
    dispatch(setDfspsError('ERROR'));
    expect(getDfspsError(getState())).toBe('ERROR');
  });

  it('Should set the dfsp Id', () => {
    dispatch(setDfspId('1'));
    expect(getDfspId(getState())).toBe('1');
  });

  it('Should get the dfsp name', () => {
    dispatch(setDfsps(dfspItems));
    dispatch(setDfspId(dfspItems[0].id));
    expect(getDfspName(getState())).toBe(dfspItems[0].name);
  });

  it('Should set the dfsps read API as pending', () => {
    dispatch(storeDFSPs());
    expect(getIsDfspsReadPending(getState())).toBe(true);
  });


  it('Should set the dfsps error when call fails', async () => {
    // Mock a failed fetch call
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await dispatch(storeDFSPs('1'));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(getDfsps(getState())).toHaveLength(0);
    expect(getDfspsError(getState())).toBeDefined();
  });
});
describe('Test the app thunk actions', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    // Mock the global fetch API
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should show the toast', () => {
    dispatch(showSuccessToast(10));
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });

  it('Should show and then hide the toast', async () => {
    dispatch(showSuccessToast(10));

    // Wait for 15ms to ensure the toast disappears
    await new Promise((resolve) => setTimeout(resolve, 15));

    expect(getIsSuccessToastVisible(getState())).toBe(false);
  });

  it('Should initialize the app', async () => {
    await dispatch(initApp());

    // Ensure Redux state updates before assertion
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getIsAppLoading(getState())).toBe(false);
  });
});

describe('Test the app load failed', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    // Mock the global fetch API
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should handle DFSPS fetch failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    await dispatch(storeDFSPs('1'));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(getDfsps(getState())).toHaveLength(0);
    expect(getDfspsError(getState())).toBeDefined();
  });
});
