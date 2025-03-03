import { createAction } from 'redux-actions';
import get from 'lodash/get';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import {
  getHubSCRootCertificate,
  getHubSCIntermediateChain,
  getHubSCServerCertificate,
  getIsHubSCEditingExisitingModel,
} from './selectors';

export const RESET_HUB_SC = 'HUB SC / Reset';
export const SET_HUB_SC_ERROR = 'HUB SC / Set Root Cert Error';
export const SET_HUB_SC_ROOT_CERTIFICATE = 'HUB SC / Set Root Certificate';
export const SET_HUB_SC_INTERMEDIATE_CHAIN = 'HUB SC / Set Intermediate Chain';
export const SET_HUB_SC_SERVER_CERTIFICATE = 'HUB SC / Set Server Certificate';
export const SET_HUB_SC_ROOT_CERTIFICATE_INFO = 'HUB SC / Set Root Certificate Info';
export const SET_HUB_SC_INTERMEDIATE_CHAIN_INFO = 'HUB SC / Set Intermediate Chain Info';
export const SET_HUB_SC_SERVER_CERTIFICATE_INFO = 'HUB SC / Set Server Certificate Info';
export const SET_HUB_SC_VALIDATIONS = 'HUB SC / Set Validations';
export const SET_HUB_SC_VALIDATION_STATE = 'HUB SC / Set Validation State';
export const CHANGE_HUB_SC_ROOT_CERTIFICATE = 'HUB SC / Change Root Certificate';
export const CHANGE_HUB_SC_INTERMEDIATE_CHAIN = 'HUB SC / Change Intermediate Chain';
export const CHANGE_HUB_SC_SERVER_CERTIFICATE = 'HUB SC / Change Server Certificate';
export const SHOW_HUB_SC_ROOT_CERTIFICATE_MODAL = 'HUB SC / Show Root Certificate Modal';
export const HIDE_HUB_SC_ROOT_CERTIFICATE_MODAL = 'HUB SC / Hide Root Certificate Modal';
export const SHOW_HUB_SC_INTERMEDIATE_CHAIN_MODAL = 'HUB SC / Show Intermediate Chain Modal';
export const HIDE_HUB_SC_INTERMEDIATE_CHAIN_MODAL = 'HUB SC / Hide Intermediate Chain Modal';
export const SHOW_HUB_SC_SERVER_CERTIFICATE_MODAL = 'HUB SC / Show Server Certificate Modal';
export const HIDE_HUB_SC_SERVER_CERTIFICATE_MODAL = 'HUB SC / Hide Server Certificate Modal';

export const resetHubSC = createAction(RESET_HUB_SC);
export const setHubSCError = createAction(SET_HUB_SC_ERROR);
export const setHubSCRootCertificate = createAction(SET_HUB_SC_ROOT_CERTIFICATE);
export const setHubSCIntermediateChain = createAction(SET_HUB_SC_INTERMEDIATE_CHAIN);
export const setHubSCServerCertificate = createAction(SET_HUB_SC_SERVER_CERTIFICATE);
export const setHubSCRootCertificateInfo = createAction(SET_HUB_SC_ROOT_CERTIFICATE_INFO);
export const setHubSCIntermediateChainInfo = createAction(SET_HUB_SC_INTERMEDIATE_CHAIN_INFO);
export const setHubSCServerCertificateInfo = createAction(SET_HUB_SC_SERVER_CERTIFICATE_INFO);
export const setHubSCValidations = createAction(SET_HUB_SC_VALIDATIONS);
export const setHubSCValidationState = createAction(SET_HUB_SC_VALIDATION_STATE);
export const changeHubSCRootCertificate = createAction(CHANGE_HUB_SC_ROOT_CERTIFICATE);
export const changeHubSCIntermediateChain = createAction(CHANGE_HUB_SC_INTERMEDIATE_CHAIN);
export const changeHubSCServerCertificate = createAction(CHANGE_HUB_SC_SERVER_CERTIFICATE);
export const showHubSCRootCertificateModal = createAction(SHOW_HUB_SC_ROOT_CERTIFICATE_MODAL);
export const hideHubSCRootCertificateModal = createAction(HIDE_HUB_SC_ROOT_CERTIFICATE_MODAL);
export const showHubSCIntermediateChainModal = createAction(SHOW_HUB_SC_INTERMEDIATE_CHAIN_MODAL);
export const hideHubSCIntermediateChainModal = createAction(HIDE_HUB_SC_INTERMEDIATE_CHAIN_MODAL);
export const showHubSCServerCertificateModal = createAction(SHOW_HUB_SC_SERVER_CERTIFICATE_MODAL);
export const hideHubSCServerCertificateModal = createAction(HIDE_HUB_SC_SERVER_CERTIFICATE_MODAL);

export const storeHubSCServerCertificate = () => async (dispatch) => {
  const { data, status } = await dispatch(api.hubServerCerts.read());

  if (is200(status) || is404(status)) {
    dispatch(setHubSCRootCertificate(get(data, 'rootCertificate')));
    dispatch(setHubSCIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setHubSCServerCertificate(get(data, 'serverCertificate')));
    dispatch(setHubSCRootCertificateInfo(get(data, 'rootCertificateInfo')));
    dispatch(setHubSCIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setHubSCServerCertificateInfo(get(data, 'serverCertificateInfo')));
    dispatch(setHubSCValidations(get(data, 'validations')));
    dispatch(setHubSCValidationState(get(data, 'validationState')));
  } else {
    dispatch(setHubSCError(data));
  }
};

export const submitHubSCServerCertificate = () => async (dispatch, getState) => {
  const rootCertificate = getHubSCRootCertificate(getState());
  const intermediateChain = getHubSCIntermediateChain(getState());
  const serverCertificate = getHubSCServerCertificate(getState());
  const body = { rootCertificate, intermediateChain, serverCertificate };
  let status;
  let data;
  if (getIsHubSCEditingExisitingModel(getState())) {
    ({ status, data } = await dispatch(api.hubServerCerts.update({ body })));
  } else {
    ({ status, data } = await dispatch(api.hubServerCerts.create({ body })));
  }
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(setHubSCRootCertificate(get(data, 'rootCertificate')));
    dispatch(setHubSCIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setHubSCServerCertificate(get(data, 'serverCertificate')));
    dispatch(setHubSCRootCertificateInfo(get(data, 'rootCertificateInfo')));
    dispatch(setHubSCIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setHubSCServerCertificateInfo(get(data, 'serverCertificateInfo')));
    dispatch(setHubSCValidations(get(data, 'validations')));
    dispatch(setHubSCValidationState(get(data, 'validationState')));
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadHubSCRootCertificate = () => (dispatch, getState) => {
  const rootCertificate = getHubSCRootCertificate(getState());
  downloadFile(rootCertificate, `root.pem`);
};

export const downloadHubSCIntermediateChain = () => (dispatch, getState) => {
  const intermediateChain = getHubSCIntermediateChain(getState());
  downloadFile(intermediateChain, `intermediates.pem`);
};

export const downloadHubSCServerCertificate = () => (dispatch, getState) => {
  const rootCertificate = getHubSCServerCertificate(getState());
  downloadFile(rootCertificate, `server.pem`);
};
