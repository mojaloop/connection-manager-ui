import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getEnvironmentId, getDfspId, getDfspName } from 'App/selectors';
import { getDfspCaRootCertificate, getDfspCaIntermediateChain } from './selectors';

export const RESET_DFSP_CA = 'DFSP CA / Reset';
export const SET_DFSP_CA_ERROR = 'DFSP CA / Set Root Cert Error';
export const SET_DFSP_CA_ROOT_CERTIFICATE = 'DFSP CA / Set Root Certificate';
export const SET_DFSP_CA_INTERMEDIATE_CHAIN = 'DFSP CA / Set Intermediate Chain';
export const SET_DFSP_CA_VALIDATIONS = 'DFSP CA / Set Validations';
export const SET_DFSP_CA_VALIDATION_STATE = 'DFSP CA / Set Validation State';
export const CHANGE_DFSP_CA_ROOT_CERTIFICATE = 'DFSP CA / Change Root Certificate';
export const CHANGE_DFSP_CA_INTERMEDIATE_CHAIN = 'DFSP CA / Change Intermediate Chain';
export const SHOW_DFSP_CA_ROOT_CERTIFICATE_MODAL = 'DFSP CA / Show Root Certificate Modal';
export const HIDE_DFSP_CA_ROOT_CERTIFICATE_MODAL = 'DFSP CA / Hide Root Certificate Modal';
export const SHOW_DFSP_CA_INTERMEDIATE_CHAIN_MODAL = 'DFSP CA / Show Intermediate Chain Modal';
export const HIDE_DFSP_CA_INTERMEDIATE_CHAIN_MODAL = 'DFSP CA / Hide Intermediate Chain Modal';

export const resetDfspCa = createAction(RESET_DFSP_CA);
export const setDfspCaError = createAction(SET_DFSP_CA_ERROR);
export const setDfspCaRootCert = createAction(SET_DFSP_CA_ROOT_CERTIFICATE);
export const setDfspCaIntermediateChain = createAction(SET_DFSP_CA_INTERMEDIATE_CHAIN);
export const setDfspCaValidations = createAction(SET_DFSP_CA_VALIDATIONS);
export const setDfspCaValidationState = createAction(SET_DFSP_CA_VALIDATION_STATE);
export const changeDfspCaRootCert = createAction(CHANGE_DFSP_CA_ROOT_CERTIFICATE);
export const changeDfspCaIntermediateChain = createAction(CHANGE_DFSP_CA_INTERMEDIATE_CHAIN);
export const showDfspCaRootCertificateModal = createAction(SHOW_DFSP_CA_ROOT_CERTIFICATE_MODAL);
export const hideDfspCaRootCertificateModal = createAction(HIDE_DFSP_CA_ROOT_CERTIFICATE_MODAL);
export const showDfspCaIntermediateChainModal = createAction(SHOW_DFSP_CA_INTERMEDIATE_CHAIN_MODAL);
export const hideDfspCaIntermediateChainModal = createAction(HIDE_DFSP_CA_INTERMEDIATE_CHAIN_MODAL);

export const storeDfspCa = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.dfspCa.read({ environmentId, dfspId }));
  if (is200(status)) {
    const { rootCertificate, intermediateChain, validations, validationState } = data;
    dispatch(setDfspCaRootCert(rootCertificate));
    dispatch(setDfspCaIntermediateChain(intermediateChain));
    dispatch(setDfspCaValidations(validations));
    dispatch(setDfspCaValidationState(validationState));
  } else {
    dispatch(setDfspCaError(data));
  }
};

export const submitDfspCa = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const dfspId = getDfspId(getState());
  const rootCertificate = getDfspCaRootCertificate(getState());
  const intermediateChain = getDfspCaIntermediateChain(getState());
  const body = {
    rootCertificate,
    intermediateChain,
  };
  const { status, data } = await dispatch(api.dfspCa.create({ environmentId, dfspId, body }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(setDfspCaRootCert(data.rootCertificate));
    dispatch(setDfspCaIntermediateChain(data.intermediateChain));
    dispatch(setDfspCaValidations(data.validations));
    dispatch(setDfspCaValidationState(data.validationState));
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const changeDfspCaRootCertificateAndSubmit = rootCertificate => (dispatch, getState) => {
  dispatch(changeDfspCaRootCert(rootCertificate));
  dispatch(submitDfspCa());
};

export const changeDfspCaIntermediateChainAndSubmit = intermediateChain => (dispatch, getState) => {
  dispatch(changeDfspCaIntermediateChain(intermediateChain));
  dispatch(submitDfspCa());
};

export const downloadDfspCaRootCertificate = () => (dispatch, getState) => {
  const dfspName = getDfspName(getState());
  const rootCertificate = getDfspCaRootCertificate(getState());
  downloadFile(rootCertificate, `${dfspName}-root.pem`);
};

export const downloadDfspCaIntermediateChain = () => (dispatch, getState) => {
  const dfspName = getDfspName(getState());
  const intermediateChain = getDfspCaIntermediateChain(getState());
  downloadFile(intermediateChain, `${dfspName}-intermediates.pem`);
};
