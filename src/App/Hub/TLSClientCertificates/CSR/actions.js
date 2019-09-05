import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getEnvironmentId } from 'App/selectors';
import { getHubCsrCertificate, getHubCsrCsrType, getHubCsrManualModel, getHubCsrDfspId } from './selectors';
import { CSR_TYPES } from './constants';

export const RESET_HUB_CSR = 'HUB CSR / Reset';
export const SET_HUB_CSR_DFSP_ID = 'HUB CSR / Set DFSP Id';
export const SET_HUB_CSR_CERTIFICATE = 'HUB CSR / Set Certificate';
export const SET_HUB_CSR_CSR_TYPE = 'Hub CSR / Set Csr Type';
export const SET_HUB_CSR_COMMON_NAME = 'Hub CSR / Set Common Name';
export const SET_HUB_CSR_ORGANIZATION = 'Hub CSR / Set Organization';
export const SET_HUB_CSR_ORGANIZATION_UNIT = 'Hub CSR / Set Organization Unit';
export const SET_HUB_CSR_EMAIL = 'Hub CSR / Set Email';
export const SET_HUB_CSR_LOCALITY = 'Hub CSR / Set Locality';
export const SET_HUB_CSR_COUNTRY = 'Hub CSR / Set Country';
export const SET_HUB_CSR_STATE = 'Hub CSR / Set State';
export const CHANGE_HUB_CSR_DNS = 'Hub CSR / Change DNS';
export const ADD_HUB_CSR_DNS = 'Hub CSR / Add DNS';
export const REMOVE_HUB_CSR_DNS = 'Hub CSR / Remove DNS';
export const CHANGE_HUB_CSR_IP = 'Hub CSR / Change IP';
export const ADD_HUB_CSR_IP = 'Hub CSR / Add IP';
export const REMOVE_HUB_CSR_IP = 'Hub CSR / Remove IP';
export const SHOW_HUB_CSR_CERTIFICATE_MODAL = 'HUB CSR / Show Certificate Modal';
export const HIDE_HUB_CSR_CERTIFICATE_MODAL = 'HUB CSR / Hide Certificate Modal';

export const resetHubCsr = createAction(RESET_HUB_CSR);
export const setHubCsrDfspId = createAction(SET_HUB_CSR_DFSP_ID);
export const setHubCsrCertificate = createAction(SET_HUB_CSR_CERTIFICATE);
export const setHubCsrCsrType = createAction(SET_HUB_CSR_CSR_TYPE);
export const setHubCsrCommonName = createAction(SET_HUB_CSR_COMMON_NAME);
export const setHubCsrOrganization = createAction(SET_HUB_CSR_ORGANIZATION);
export const setHubCsrOrganizationUnit = createAction(SET_HUB_CSR_ORGANIZATION_UNIT);
export const setHubCsrEmail = createAction(SET_HUB_CSR_EMAIL);
export const setHubCsrLocality = createAction(SET_HUB_CSR_LOCALITY);
export const setHubCsrCountry = createAction(SET_HUB_CSR_COUNTRY);
export const setHubCsrState = createAction(SET_HUB_CSR_STATE);
export const changeHubCsrDns = createAction(CHANGE_HUB_CSR_DNS);
export const addHubCsrDns = createAction(ADD_HUB_CSR_DNS);
export const removeHubCsrDns = createAction(REMOVE_HUB_CSR_DNS);
export const changeHubCsrIp = createAction(CHANGE_HUB_CSR_IP);
export const addHubCsrIp = createAction(ADD_HUB_CSR_IP);
export const removeHubCsrIp = createAction(REMOVE_HUB_CSR_IP);
export const showHubCsrModal = createAction(SHOW_HUB_CSR_CERTIFICATE_MODAL);
export const hideHubCsrModal = createAction(HIDE_HUB_CSR_CERTIFICATE_MODAL);

export const submitHubCsr = () => async (dispatch, getState) => {
  const environmentId = getEnvironmentId(getState());
  const dfspId = getHubCsrDfspId(getState());
  const csrType = getHubCsrCsrType(getState());
  let status;
  let data;

  if (csrType === CSR_TYPES.FILE) {
    const hubCSR = getHubCsrCertificate(getState());
    const body = { hubCSR };
    ({ data, status } = await dispatch(api.outboundEnrollments.create({ environmentId, dfspId, body })));
  } else {
    const body = getHubCsrManualModel(getState());
    ({ data, status } = await dispatch(api.outboundEnrollmentCsr.create({ environmentId, dfspId, body })));
  }

  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(resetHubCsr());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};
