import { fetchMock, MATCHED } from 'fetch-mock';
import prepareStore, { getStore } from 'tests/store';

jest.mock('utils/api', () => ({
  hubCa: {
    read: jest.fn(),
  },
}));

import {
  resetHubExternalCa,
  setHubExternalCaError,
  setHubExternalCaRootCertificate,
  setHubExternalCaIntermediateChain,
  showHubExternalCaRootCertificateModal,
  hideHubExternalCaRootCertificateModal,
  showHubExternalCaIntermediateChainModal,
  hideHubExternalCaIntermediateChainModal,
  storeHubExternalCa,
  submitHubExternalCa,
} from './actions';

import {
  getHubExternalCaError,
  getHubExternalCaRootCertificate,
  getHubExternalCaIntermediateChain,
  getIsHubExternalCaRootCertificateModalVisible,
  getIsHubExternalCaIntermediateChainModalVisible,
} from './selectors';

import { initialState } from './reducers';

let dispatch;
let getState;

describe('Test the HUB EXTERNAL CA actions', () => {
  beforeEach(() => {
    const store = getStore();
    ({ dispatch, getState } = store);
  });

  it('Should reset the reducers', () => {
    dispatch(resetHubExternalCa());
    expect(getState().hub.ca.external).toEqual(initialState);
  });

  it('Should set the error', () => {
    dispatch(setHubExternalCaError('ERROR'));
    expect(getHubExternalCaError(getState())).toBe('ERROR');
  });

  it('Should change the root certificate', () => {
    dispatch(setHubExternalCaRootCertificate('ROOT_CERT'));
    expect(getHubExternalCaRootCertificate(getState())).toBe('ROOT_CERT');
  });

  it('Should change the intermediate chain', () => {
    dispatch(setHubExternalCaIntermediateChain('CHAIN'));
    expect(getHubExternalCaIntermediateChain(getState())).toBe('CHAIN');
  });

  it('Should show the root certificate modal', () => {
    dispatch(showHubExternalCaRootCertificateModal());
    expect(getIsHubExternalCaRootCertificateModalVisible(getState())).toBe(true);
  });

  it('Should hide the root certificate modal', () => {
    dispatch(hideHubExternalCaRootCertificateModal());
    expect(getIsHubExternalCaRootCertificateModalVisible(getState())).toBe(false);
  });

  it('Should show the intermediate chain modal', () => {
    dispatch(showHubExternalCaIntermediateChainModal());
    expect(getIsHubExternalCaIntermediateChainModalVisible(getState())).toBe(true);
  });

  it('Should hide the intermediate chain modal', () => {
    dispatch(hideHubExternalCaIntermediateChainModal());
    expect(getIsHubExternalCaIntermediateChainModalVisible(getState())).toBe(false);
  });

  /* Example of testing API calls
  it('Should make an API call to fetch CA details', async () => {
    // Mocking the API response
    const mockApiResponse = { success: true, data: 'some_data' };
    require('utils/api').hubCa.read.mockResolvedValue(mockApiResponse);

    // Dispatching the action that triggers the API call
    await dispatch(submitHubExternalCa());

    // Ensuring that the API call was made
    expect(require('utils/api').hubCa.read).toHaveBeenCalledTimes(1);

    // You can also test state changes based on the response if applicable
    // expect(getState().hub.ca.external.data).toBe(mockApiResponse.data);
  });
  */
});
