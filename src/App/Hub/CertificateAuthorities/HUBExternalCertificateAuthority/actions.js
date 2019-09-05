import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getEnvironmentId } from 'App/selectors';
import { getHubExternalCaRootCertificate, getHubExternalCaIntermediateChain, getHubExternalCaName } from './selectors';

export const RESET_HUB_EXTERNAL_CA = 'HUB EXTERNAL CA / Reset';
export const SET_HUB_EXTERNAL_CA_ERROR = 'HUB EXTERNAL CA / Set Root Cert Error';
export const SET_HUB_EXTERNAL_CA_CERTIFICATES = 'HUB EXTERNAL CA / Set Certificates';
export const SET_HUB_EXTERNAL_CA_ROOT_CERTIFICATE = 'HUB EXTERNAL CA / Set Root Certificate';
export const SET_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN = 'HUB EXTERNAL CA / Set Intermediate Chain';
export const SET_HUB_EXTERNAL_CA_NAME = 'HUB EXTERNAL CA / Set Name';
export const RESET_HUB_EXTERNAL_CA_FORM = 'HUB EXTERNAL CA / Reset Form';
export const SHOW_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL = 'HUB EXTERNAL CA / Show Root Certificate Modal';
export const HIDE_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL = 'HUB EXTERNAL CA / Hide Root Certificate Modal';
export const SHOW_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL = 'HUB EXTERNAL CA / Show Intermediate Chain Modal';
export const HIDE_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL = 'HUB EXTERNAL CA / Hide Intermediate Chain Modal';

export const resetHubExternalCa = createAction(RESET_HUB_EXTERNAL_CA);
export const setHubExternalCaError = createAction(SET_HUB_EXTERNAL_CA_ERROR);
export const setHubExternalCaCertificates = createAction(SET_HUB_EXTERNAL_CA_CERTIFICATES);
export const setHubExternalCaRootCertificate = createAction(SET_HUB_EXTERNAL_CA_ROOT_CERTIFICATE);
export const setHubExternalCaIntermediateChain = createAction(SET_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN);
export const setHubExternalCaName = createAction(SET_HUB_EXTERNAL_CA_NAME);
export const resetHubExternalCaForm = createAction(RESET_HUB_EXTERNAL_CA_FORM);
export const showHubExternalCaRootCertificateModal = createAction(SHOW_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL);
export const hideHubExternalCaRootCertificateModal = createAction(HIDE_HUB_EXTERNAL_CA_ROOT_CERTIFICATE_MODAL);
export const showHubExternalCaIntermediateChainModal = createAction(SHOW_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL);
export const hideHubExternalCaIntermediateChainModal = createAction(HIDE_HUB_EXTERNAL_CA_INTERMEDIATE_CHAIN_MODAL);

export const storeHubExternalCas = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const { data, status } = await dispatch(api.hubExternalCas.read({ environmentId }));
  if (is200(status)) {
    dispatch(setHubExternalCaCertificates(data));
  } else {
    dispatch(setHubExternalCaError(data));
  }
};

export const submitHubExternalCa = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const name = getHubExternalCaName(getState());
  const rootCertificate = getHubExternalCaRootCertificate(getState());
  const intermediateChain = getHubExternalCaIntermediateChain(getState());
  const body = {
    name,
    rootCertificate,
    intermediateChain,
    type: 'EXTERNAL',
  };
  const { status, data } = await dispatch(api.hubExternalCas.create({ environmentId, body }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(resetHubExternalCaForm());
    dispatch(storeHubExternalCas());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadHubExternalCaRootCertificate = (rootCertificate, name) => (dispatch, getState) => {
  const filename = `${name ? `${name}-` : ''}hub-root.pem`;
  downloadFile(rootCertificate, filename);
};

export const downloadHubExternalCaIntermediateChain = (intermediateChain, name) => (dispatch, getState) => {
  const filename = `${name ? `${name}-` : ''}hub-intermediates.pem`;
  downloadFile(intermediateChain, filename);
};
