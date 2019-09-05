import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getEnvironmentId, getEnvironmentName } from 'App/selectors';
import { getHubCaModel, getHubCaRootCertificate } from './selectors';

export const RESET_HUB_CA = 'HUB CA / Reset';
export const SET_HUB_CA_ERROR = 'HUB CA / Set Root Cert Error';
export const SET_HUB_CA_COMMON_NAME = 'HUB CA / Set Common Name';
export const SET_HUB_CA_ORGANIZATION = 'HUB CA / Set Organization';
export const SET_HUB_CA_ORGANIZATION_UNIT = 'HUB CA / Set Organization Unit';
export const SET_HUB_CA_LOCALITY = 'HUB CA / Set Locality';
export const SET_HUB_CA_STATE = 'HUB CA / Set State';
export const SET_HUB_CA_COUNTRY = 'HUB CA / Set Country';
export const CHANGE_HUB_CA_HOST = 'Hub CA / Change HOST';
export const ADD_HUB_CA_HOST = 'Hub CA / Add HOST';
export const REMOVE_HUB_CA_HOST = 'Hub CA / Remove HOST';
export const SET_HUB_CA_ROOT_CERTIFICATE = 'HUB CA / Set Root Certificate';
export const SET_HUB_CA_ROOT_CERTIFICATE_INFO = 'HUB CA / Set Root Certificate Info';
export const SHOW_HUB_CA_ROOT_CERTIFICATE_MODAL = 'HUB CA / Show Root Certificate Modal';
export const HIDE_HUB_CA_ROOT_CERTIFICATE_MODAL = 'HUB CA / Hide Root Certificate Modal';

export const resetHubCa = createAction(RESET_HUB_CA);
export const setHubCaError = createAction(SET_HUB_CA_ERROR);
export const setHubCaCommonName = createAction(SET_HUB_CA_COMMON_NAME);
export const setHubCaOrganization = createAction(SET_HUB_CA_ORGANIZATION);
export const setHubCaOrganizationUnit = createAction(SET_HUB_CA_ORGANIZATION_UNIT);
export const setHubCaLocality = createAction(SET_HUB_CA_LOCALITY);
export const setHubCaState = createAction(SET_HUB_CA_STATE);
export const setHubCaCountry = createAction(SET_HUB_CA_COUNTRY);
export const changeHubCaHost = createAction(CHANGE_HUB_CA_HOST);
export const addHubCaHost = createAction(ADD_HUB_CA_HOST);
export const removeHubCaHost = createAction(REMOVE_HUB_CA_HOST);
export const setHubCaRootCertificate = createAction(SET_HUB_CA_ROOT_CERTIFICATE);
export const setHubCaRootCertificateInfo = createAction(SET_HUB_CA_ROOT_CERTIFICATE_INFO);
export const showHubCaRootCertificateModal = createAction(SHOW_HUB_CA_ROOT_CERTIFICATE_MODAL);
export const hideHubCaRootCertificateModal = createAction(HIDE_HUB_CA_ROOT_CERTIFICATE_MODAL);

export const storeHubCa = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const { data, status } = await dispatch(api.hubCa.read({ environmentId }));
  if (is200(status) || is404(status)) {
    const { certificate, certInfo } = data;
    dispatch(setHubCaRootCertificate(certificate));
    dispatch(setHubCaRootCertificateInfo(certInfo));
  } else {
    dispatch(setHubCaError(data));
  }
};

export const submitHubCa = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const body = getHubCaModel(getState());
  const { status, data } = await dispatch(api.hubCas.create({ environmentId, body }));
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(storeHubCa());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadHubCaRootCertificate = () => (dispatch, getState) => {
  const environmentName = getEnvironmentName(getState());
  const rootCertificate = getHubCaRootCertificate(getState());
  downloadFile(rootCertificate, `${environmentName}-root.pem`);
};
