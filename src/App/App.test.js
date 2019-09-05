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
  setEnvironments,
  setEnvironmentsError,
  setEnvironmentId,
  setDfsps,
  setDfspsError,
  setDfspId,
  storeEnvironments,
  storeDFSPs,
  initApp,
  initEnvironment,
  showSuccessToast,
} from './actions';

import {
  getIsAppLoading,
  getIsSuccessToastVisible,
  getIsErrorModalVisible,
  getErrorModalContent,
  getEnvironments,
  getEnvironmentsError,
  getEnvironmentId,
  getDfsps,
  getDfspsError,
  getDfspId,
  getIsAppLoadingFailed,
  getEnvironmentName,
  getDfspName,
  getIsDfspsReadPending,
} from './selectors';

const environmentItems = [
  {
    id: '1',
    name: 'test',
  },
  {
    id: '2',
    name: 'dev',
  },
];
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

  it('Should set the environments', () => {
    dispatch(setEnvironments(environmentItems));
    const environments = getEnvironments(getState());
    expect(environments).toHaveLength(environmentItems.length);
    expect(environments[0].id).toBe(environmentItems[0].id);
    expect(environments[0].name).toBe(environmentItems[0].name);
  });

  it('Should set the environments error', () => {
    dispatch(setEnvironmentsError('ERROR'));
    const environmentsError = getEnvironmentsError(getState());
    expect(environmentsError).toBe('ERROR');
  });

  it('Should set the environment Id', () => {
    dispatch(setEnvironmentId(environmentItems[0].id));
    expect(getEnvironmentId(getState())).toBe(environmentItems[0].id);
  });

  it('Should get the environment name', () => {
    dispatch(setEnvironments(environmentItems));
    dispatch(setEnvironmentId(environmentItems[0].id));
    expect(getEnvironmentName(getState())).toBe(environmentItems[0].name);
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

  it('Should store the environments', async () => {
    fetchMock.get('end:/environments', environmentItems);
    await dispatch(storeEnvironments());

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getEnvironments(getState())).toHaveLength(2);
    expect(getEnvironmentsError(getState())).toBeUndefined();
  });

  it('Should set the environment error when call fails', async () => {
    fetchMock.get('end:/environments', 500);
    await dispatch(storeEnvironments());

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getEnvironments(getState())).toHaveLength(0);
    expect(getEnvironmentsError(getState())).toBeDefined();
  });

  it('Should store the dfsps', async () => {
    fetchMock.get('end:/1/dfsps', dfspItems);
    await dispatch(storeDFSPs('1'));

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getDfsps(getState())).toHaveLength(2);
    expect(getDfspsError(getState())).toBeUndefined();
  });

  it('Should set the dfsps error when call fails', async () => {
    fetchMock.get('end:/1/dfsps', 500);
    await dispatch(storeDFSPs('1'));

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
    fetchMock.get('end:/environments', environmentItems);
    fetchMock.get('end:/1/dfsps', dfspItems);
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
    expect(getEnvironments(getState())).not.toHaveLength(0);
  });

  it('Should initialize the environment', async () => {
    await dispatch(initEnvironment('1'));
    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(getEnvironmentId(getState())).toBe('1');
    expect(getDfsps(getState())).not.toHaveLength(0);
  });
});

describe('Test the the app load failed', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);

    fetchMock.restore();
    fetchMock.get('end:/environments', environmentItems);
    fetchMock.get('end:/1/dfsps', dfspItems);
  });

  it('Should be failed when is not loading and there are no environments', () => {
    dispatch(unsetAppLoading());
    dispatch(setEnvironments([]));
    expect(getIsAppLoadingFailed(getState())).toBe(true);
  });

  it('Should be failed when is not loading and there was an environment api call failed', () => {
    dispatch(unsetAppLoading());
    dispatch(setEnvironmentsError('ERROR'));
    expect(getIsAppLoadingFailed(getState())).toBe(true);
  });
});
