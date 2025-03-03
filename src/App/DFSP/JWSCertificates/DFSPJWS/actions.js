import { createAction } from 'redux-actions';
import get from 'lodash/get';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { showSuccessToast, showErrorModal } from 'App/actions';
import { getDfspId } from 'App/selectors';
import { getDfspJWSJwsCertificate, getDfspJWSIntermediateChain, getIsDfspJWSEditingExisitingModel } from './selectors';

export const RESET_DFSP_JWS = 'DFSP JWS / Reset';
export const SET_DFSP_JWS_ERROR = 'DFSP JWS / Set JWS Cert Error';
export const SET_DFSP_JWS_JWS_CERTIFICATE = 'DFSP JWS / Set JWS Certificate';
export const SET_DFSP_JWS_INTERMEDIATE_CHAIN = 'DFSP JWS / Set Intermediate Chain';
export const SET_DFSP_JWS_JWS_CERTIFICATE_INFO = 'DFSP JWS / Set JWS Certificate Info';
export const SET_DFSP_JWS_INTERMEDIATE_CHAIN_INFO = 'DFSP JWS / Set Intermediate Chain Info';
export const SET_DFSP_JWS_VALIDATIONS = 'DFSP JWS / Set Validations';
export const SET_DFSP_JWS_VALIDATION_STATE = 'DFSP JWS / Set Validation State';
export const CHANGE_DFSP_JWS_JWS_CERTIFICATE = 'DFSP JWS / Change JWS Certificate';
export const CHANGE_DFSP_JWS_INTERMEDIATE_CHAIN = 'DFSP JWS / Change Intermediate Chain';
export const SHOW_DFSP_JWS_JWS_CERTIFICATE_MODAL = 'DFSP JWS / Show JWS Certificate Modal';
export const HIDE_DFSP_JWS_JWS_CERTIFICATE_MODAL = 'DFSP JWS / Hide JWS Certificate Modal';
export const SHOW_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL = 'DFSP JWS / Show Intermediate Chain Modal';
export const HIDE_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL = 'DFSP JWS / Hide Intermediate Chain Modal';

export const resetDfspJWS = createAction(RESET_DFSP_JWS);
export const setDfspJWSError = createAction(SET_DFSP_JWS_ERROR);
export const setDfspJWSJwsCertificate = createAction(SET_DFSP_JWS_JWS_CERTIFICATE);
export const setDfspJWSIntermediateChain = createAction(SET_DFSP_JWS_INTERMEDIATE_CHAIN);
export const setDfspJWSJwsCertificateInfo = createAction(SET_DFSP_JWS_JWS_CERTIFICATE_INFO);
export const setDfspJWSIntermediateChainInfo = createAction(SET_DFSP_JWS_INTERMEDIATE_CHAIN_INFO);
export const setDfspJWSValidations = createAction(SET_DFSP_JWS_VALIDATIONS);
export const setDfspJWSValidationState = createAction(SET_DFSP_JWS_VALIDATION_STATE);
export const showDfspJWSJwsCertificateModal = createAction(SHOW_DFSP_JWS_JWS_CERTIFICATE_MODAL);
export const changeDfspJWSJwsCertificate = createAction(CHANGE_DFSP_JWS_JWS_CERTIFICATE);
export const changeDfspJWSIntermediateChain = createAction(CHANGE_DFSP_JWS_INTERMEDIATE_CHAIN);
export const hideDfspJWSJwsCertificateModal = createAction(HIDE_DFSP_JWS_JWS_CERTIFICATE_MODAL);
export const showDfspJWSIntermediateChainModal = createAction(SHOW_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL);
export const hideDfspJWSIntermediateChainModal = createAction(HIDE_DFSP_JWS_INTERMEDIATE_CHAIN_MODAL);

export const storeDfspJWSCertificates = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const { data, status } = await dispatch(api.dfspJWSCerts.read({ dfspId }));
  if (is200(status) || is404(status)) {
    dispatch(setDfspJWSJwsCertificate(get(data, 'jwsCertificate')));
    dispatch(setDfspJWSIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setDfspJWSJwsCertificateInfo(get(data, 'jwsCertificateInfo')));
    dispatch(setDfspJWSIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setDfspJWSValidations(get(data, 'validations')));
    dispatch(setDfspJWSValidationState(get(data, 'validationState')));
  } else {
    dispatch(setDfspJWSError(data));
  }
};

export const submitDfspJWSCertificates = () => async (dispatch, getState) => {
  const dfspId = getDfspId(getState());
  const jwsCertificate = getDfspJWSJwsCertificate(getState());
  const intermediateChain = getDfspJWSIntermediateChain(getState());
  const body = { jwsCertificate, intermediateChain };
  let status;
  let data;
  if (getIsDfspJWSEditingExisitingModel(getState())) {
    ({ status, data } = await dispatch(api.dfspJWSCerts.update({ dfspId, body })));
  } else {
    ({ status, data } = await dispatch(api.dfspJWSCerts.create({ dfspId, body })));
  }
  if (is200(status)) {
    dispatch(showSuccessToast());
    dispatch(setDfspJWSJwsCertificate(get(data, 'jwsCertificate')));
    dispatch(setDfspJWSIntermediateChain(get(data, 'intermediateChain')));
    dispatch(setDfspJWSJwsCertificateInfo(get(data, 'jwsCertificateInfo')));
    dispatch(setDfspJWSIntermediateChainInfo(get(data, 'intermediateChainInfo[0]')));
    dispatch(setDfspJWSValidations(get(data, 'validations')));
    dispatch(setDfspJWSValidationState(get(data, 'validationState')));
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};

export const downloadDfspJWSJwsCertificate = () => ( getState) => {
  const jwsCertificate = getDfspJWSJwsCertificate(getState());
  downloadFile(jwsCertificate, `root.pem`);
};

export const downloadDfspJWSIntermediateChain = () => (  getState) => {
  const intermediateChain = getDfspJWSIntermediateChain(getState());
  downloadFile(intermediateChain, `intermediates.pem`);
};
