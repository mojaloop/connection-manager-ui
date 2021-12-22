import { createAction } from 'redux-actions';
import get from 'lodash/get';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfspId } from 'App/selectors';
import {
  getDfspSCRootCertificate,
  getDfspSCIntermediateChain,
  getDfspSCServerCertificate,
  getIsDfspSCEditingExisitingModel,
} from './selectors';

export const RESET_DFSP_SC = 'DFSP SC / Reset';
export const SET_DFSP_SC_ERROR = 'DFSP SC / Set Root Cert Error';
export const SET_DFSP_SC_ROOT_CERTIFICATE = 'DFSP SC / Set Root Certificate';
export const SET_DFSP_SC_INTERMEDIATE_CHAIN = 'DFSP SC / Set Intermediate Chain';
export const SET_DFSP_SC_SERVER_CERTIFICATE = 'DFSP SC / Set Server Certificate';
export const SET_DFSP_SC_ROOT_CERTIFICATE_INFO = 'DFSP SC / Set Root Certificate Info';
export const SET_DFSP_SC_INTERMEDIATE_CHAIN_INFO = 'DFSP SC / Set Intermediate Chain Info';
export const SET_DFSP_SC_SERVER_CERTIFICATE_INFO = 'DFSP SC / Set Server Certificate Info';
export const SET_DFSP_SC_VALIDATIONS = 'DFSP SC / Set Validations';
export const SET_DFSP_SC_VALIDATION_STATE = 'DFSP SC / Set Validation State';
export const CHANGE_DFSP_SC_ROOT_CERTIFICATE = 'DFSP SC / Change Root Certificate';
export const CHANGE_DFSP_SC_INTERMEDIATE_CHAIN = 'DFSP SC / Change Intermediate Chain';
export const CHANGE_DFSP_SC_SERVER_CERTIFICATE = 'DFSP SC / Change Server Certificate';
export const SHOW_DFSP_SC_ROOT_CERTIFICATE_MODAL = 'DFSP SC / Show Root Certificate Modal';
export const HIDE_DFSP_SC_ROOT_CERTIFICATE_MODAL = 'DFSP SC / Hide Root Certificate Modal';
export const SHOW_DFSP_SC_INTERMEDIATE_CHAIN_MODAL = 'DFSP SC / Show Intermediate Chain Modal';
export const HIDE_DFSP_SC_INTERMEDIATE_CHAIN_MODAL = 'DFSP SC / Hide Intermediate Chain Modal';
export const SHOW_DFSP_SC_SERVER_CERTIFICATE_MODAL = 'DFSP SC / Show Server Certificate Modal';
export const HIDE_DFSP_SC_SERVER_CERTIFICATE_MODAL = 'DFSP SC / Hide Server Certificate Modal';

export const resetDfspSC = createAction(RESET_DFSP_SC);
export const setDfspSCError = createAction(SET_DFSP_SC_ERROR);
export const setDfspSCRootCertificate = createAction(SET_DFSP_SC_ROOT_CERTIFICATE);
export const setDfspSCIntermediateChain = createAction(SET_DFSP_SC_INTERMEDIATE_CHAIN);
export const setDfspSCServerCertificate = createAction(SET_DFSP_SC_SERVER_CERTIFICATE);
export const setDfspSCRootCertificateInfo = createAction(SET_DFSP_SC_ROOT_CERTIFICATE_INFO);
export const setDfspSCIntermediateChainInfo = createAction(SET_DFSP_SC_INTERMEDIATE_CHAIN_INFO);
export const setDfspSCServerCertificateInfo = createAction(SET_DFSP_SC_SERVER_CERTIFICATE_INFO);
export const setDfspSCValidations = createAction(SET_DFSP_SC_VALIDATIONS);
export const setDfspSCValidationState = createAction(SET_DFSP_SC_VALIDATION_STATE);
export const showDfspSCRootCertificateModal = createAction(SHOW_DFSP_SC_ROOT_CERTIFICATE_MODAL);
export const changeDfspSCRootCertificate = createAction(CHANGE_DFSP_SC_ROOT_CERTIFICATE);
export const changeDfspSCIntermediateChain = createAction(CHANGE_DFSP_SC_INTERMEDIATE_CHAIN);
export const changeDfspSCServerCertificate = createAction(CHANGE_DFSP_SC_SERVER_CERTIFICATE);
export const hideDfspSCRootCertificateModal = createAction(HIDE_DFSP_SC_ROOT_CERTIFICATE_MODAL);
export const showDfspSCIntermediateChainModal = createAction(SHOW_DFSP_SC_INTERMEDIATE_CHAIN_MODAL);
export const hideDfspSCIntermediateChainModal = createAction(HIDE_DFSP_SC_INTERMEDIATE_CHAIN_MODAL);
export const showDfspSCServerCertificateModal = createAction(SHOW_DFSP_SC_SERVER_CERTIFICATE_MODAL);
export const hideDfspSCServerCertificateModal = createAction(HIDE_DFSP_SC_SERVER_CERTIFICATE_MODAL);

export const storeDfspSCServerCertificate = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.dfspServerCerts.read({ dfspId }));
  if (is200(status) || is404(status)) {
    dispatch(setDfspSCRootCertificate(get(data, 'rootCertificate')));
    dispatch(setDfspSCIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setDfspSCServerCertificate(get(data, 'serverCertificate')));
    dispatch(setDfspSCRootCertificateInfo(get(data, 'rootCertificateInfo')));
    dispatch(setDfspSCIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setDfspSCServerCertificateInfo(get(data, 'serverCertificateInfo')));
    dispatch(setDfspSCValidations(get(data, 'validations')));
    dispatch(setDfspSCValidationState(get(data, 'validationState')));
  } else {
    dispatch(setDfspSCError(data));
  }
};

export const submitDfspSCServerCertificate = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const rootCertificate = getDfspSCRootCertificate(getState());
  const intermediateChain = getDfspSCIntermediateChain(getState());
  const serverCertificate = getDfspSCServerCertificate(getState());
  const body = { rootCertificate, intermediateChain, serverCertificate };
  let status;
  let data;
  if (getIsDfspSCEditingExisitingModel(getState())) {
    ({ status, data } = await dispatch(api.dfspServerCerts.update({ dfspId, body })));
  } else {
    ({ status, data } = await dispatch(api.dfspServerCerts.create({ dfspId, body })));
  }
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(setDfspSCRootCertificate(get(data, 'rootCertificate')));
    dispatch(setDfspSCIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setDfspSCServerCertificate(get(data, 'serverCertificate')));
    dispatch(setDfspSCRootCertificateInfo(get(data, 'rootCertificateInfo')));
    dispatch(setDfspSCIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setDfspSCServerCertificateInfo(get(data, 'serverCertificateInfo')));
    dispatch(setDfspSCValidations(get(data, 'validations')));
    dispatch(setDfspSCValidationState(get(data, 'validationState')));
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadDfspSCRootCertificate = () => (dispatch, getState) => {
  const rootCertificate = getDfspSCRootCertificate(getState());
  downloadFile(rootCertificate, `root.pem`);
};

export const downloadDfspSCIntermediateChain = () => (dispatch, getState) => {
  const intermediateChain = getDfspSCIntermediateChain(getState());
  downloadFile(intermediateChain, `intermediates.pem`);
};

export const downloadDfspSCServerCertificate = () => (dispatch, getState) => {
  const rootCertificate = getDfspSCServerCertificate(getState());
  downloadFile(rootCertificate, `server.pem`);
};
