import { fetchMock, MATCHED } from 'fetch-mock';
import { getStore } from 'tests/store';
import { sleep } from 'utils/async';

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
    name: 'MTN CI',
    securityGroup: 'Application/DFSP:MTN CI',
  },
  {
    id: 'Orange CI',
    name: 'Orange CI',
    securityGroup: 'Application/DFSP:Orange CI',
  },
];

let dispatch;
let getState;

describe('Test the app actions', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    fetchMock.restore();
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

  it('Should set the dfsps read api is pending', () => {
    dispatch(storeDFSPs());
    expect(getIsDfspsReadPending(getState())).toBe(true);
  });

  it('Should store the dfsps', async () => {
    fetchMock.get('end:/dfsps', dfspItems);
    await dispatch(storeDFSPs());

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfsps(getState())).toHaveLength(2);
    expect(getDfspsError(getState())).toBeUndefined();
  });

  it('Should set the dfsps error when call fails', async () => {
    fetchMock.get('end:/dfsps', 500);
    await dispatch(storeDFSPs());

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfsps(getState())).toHaveLength(0);
    expect(getDfspsError(getState())).toBeDefined();
  });
});

describe('Test the app thunk actions', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    fetchMock.restore();
    fetchMock.get('end:/dfsps', dfspItems);
  });

  it('Should show the toast ', () => {
    dispatch(showSuccessToast(10));
    expect(getIsSuccessToastVisible(getState())).toBe(true);
  });
  it('Should show and hide the toast', async () => {
    await dispatch(showSuccessToast(10));
    expect(getIsSuccessToastVisible(getState())).toBe(false);
  });

  it('Should initialize the app', async () => {
    await dispatch(initApp());
    expect(getIsAppLoading(getState())).toBe(false);
  });
});
