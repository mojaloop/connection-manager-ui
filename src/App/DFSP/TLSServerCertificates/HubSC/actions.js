import { createAction } from 'redux-actions';
import get from 'lodash/get';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { getDfspHubSCRootCertificate, getDfspHubSCIntermediateChain, getDfspHubSCServerCertificate } from './selectors';

export const RESET_DFSP_HUB_SC = 'DFSP HUB SC / Reset';
export const SET_DFSP_HUB_SC_ERROR = 'DFSP HUB SC / Set Root Cert Error';
export const SET_DFSP_HUB_SC_ROOT_CERTIFICATE = 'DFSP HUB SC / Set Root Certificate';
export const SET_DFSP_HUB_SC_INTERMEDIATE_CHAIN = 'DFSP HUB SC / Set Intermediate Chain';
export const SET_DFSP_HUB_SC_SERVER_CERTIFICATE = 'DFSP HUB SC / Set Server Certificate';
export const SET_DFSP_HUB_SC_ROOT_CERTIFICATE_INFO = 'DFSP HUB SC / Set Root Certificate Info';
export const SET_DFSP_HUB_SC_INTERMEDIATE_CHAIN_INFO = 'DFSP HUB SC / Set Intermediate Chain Info';
export const SET_DFSP_HUB_SC_SERVER_CERTIFICATE_INFO = 'DFSP HUB SC / Set Server Certificate Info';
export const SET_DFSP_HUB_SC_VALIDATIONS = 'DFSP HUB SC / Set Validations';
export const SET_DFSP_HUB_SC_VALIDATION_STATE = 'DFSP HUB SC / Set Validation State';
export const SHOW_DFSP_HUB_SC_ROOT_CERTIFICATE_MODAL = 'DFSP HUB SC / Show Root Certificate Modal';
export const HIDE_DFSP_HUB_SC_ROOT_CERTIFICATE_MODAL = 'DFSP HUB SC / Hide Root Certificate Modal';
export const SHOW_DFSP_HUB_SC_INTERMEDIATE_CHAIN_MODAL = 'DFSP HUB SC / Show Intermediate Chain Modal';
export const HIDE_DFSP_HUB_SC_INTERMEDIATE_CHAIN_MODAL = 'DFSP HUB SC / Hide Intermediate Chain Modal';
export const SHOW_DFSP_HUB_SC_SERVER_CERTIFICATE_MODAL = 'DFSP HUB SC / Show Server Certificate Modal';
export const HIDE_DFSP_HUB_SC_SERVER_CERTIFICATE_MODAL = 'DFSP HUB SC / Hide Server Certificate Modal';

export const resetDfspHubSC = createAction(RESET_DFSP_HUB_SC);
export const setDfspHubSCError = createAction(SET_DFSP_HUB_SC_ERROR);
export const setDfspHubSCRootCertificate = createAction(SET_DFSP_HUB_SC_ROOT_CERTIFICATE);
export const setDfspHubSCIntermediateChain = createAction(SET_DFSP_HUB_SC_INTERMEDIATE_CHAIN);
export const setDfspHubSCServerCertificate = createAction(SET_DFSP_HUB_SC_SERVER_CERTIFICATE);
export const setDfspHubSCRootCertificateInfo = createAction(SET_DFSP_HUB_SC_ROOT_CERTIFICATE_INFO);
export const setDfspHubSCIntermediateChainInfo = createAction(SET_DFSP_HUB_SC_INTERMEDIATE_CHAIN_INFO);
export const setDfspHubSCServerCertificateInfo = createAction(SET_DFSP_HUB_SC_SERVER_CERTIFICATE_INFO);
export const setDfspHubSCValidations = createAction(SET_DFSP_HUB_SC_VALIDATIONS);
export const setDfspHubSCValidationState = createAction(SET_DFSP_HUB_SC_VALIDATION_STATE);
export const showDfspHubSCRootCertificateModal = createAction(SHOW_DFSP_HUB_SC_ROOT_CERTIFICATE_MODAL);
export const hideDfspHubSCRootCertificateModal = createAction(HIDE_DFSP_HUB_SC_ROOT_CERTIFICATE_MODAL);
export const showDfspHubSCIntermediateChainModal = createAction(SHOW_DFSP_HUB_SC_INTERMEDIATE_CHAIN_MODAL);
export const hideDfspHubSCIntermediateChainModal = createAction(HIDE_DFSP_HUB_SC_INTERMEDIATE_CHAIN_MODAL);
export const showDfspHubSCServerCertificateModal = createAction(SHOW_DFSP_HUB_SC_SERVER_CERTIFICATE_MODAL);
export const hideDfspHubSCServerCertificateModal = createAction(HIDE_DFSP_HUB_SC_SERVER_CERTIFICATE_MODAL);

export const storeDfspHubSCServerCertificate = () => async (dispatch, getState) => {
  const { data, status } = await dispatch(api.hubServerCerts.read());
  if (is200(status)) {
    dispatch(setDfspHubSCRootCertificate(get(data, 'rootCertificate')));
    dispatch(setDfspHubSCIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setDfspHubSCServerCertificate(get(data, 'serverCertificate')));
    dispatch(setDfspHubSCRootCertificateInfo(get(data, 'rootCertificateInfo')));
    dispatch(setDfspHubSCIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setDfspHubSCServerCertificateInfo(get(data, 'serverCertificateInfo')));
    dispatch(setDfspHubSCValidations(get(data, 'validations')));
    dispatch(setDfspHubSCValidationState(get(data, 'validationState')));
  } else if (!is404(status)) {
    dispatch(setDfspHubSCError(data));
  }
};

export const downloadDfspHubSCRootCertificate = () => (dispatch, getState) => {
  const rootCertificate = getDfspHubSCRootCertificate(getState());
  downloadFile(rootCertificate, `hub-root.pem`);
};

export const downloadDfspHubSCIntermediateChain = () => (dispatch, getState) => {
  const intermediateChain = getDfspHubSCIntermediateChain(getState());
  downloadFile(intermediateChain, `hub-intermediates.pem`);
};

export const downloadDfspHubSCServerCertificate = () => (dispatch, getState) => {
  const serverCertificate = getDfspHubSCServerCertificate(getState());
  downloadFile(serverCertificate, `hub-root.pem`);
};
