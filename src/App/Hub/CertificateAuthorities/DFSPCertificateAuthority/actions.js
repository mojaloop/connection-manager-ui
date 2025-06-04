import { createAction } from 'redux-actions';
import get from 'lodash/get';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';
import { getDfsps } from 'App/selectors';

export const RESET_HUB_DFSP_CAS = 'HUB DFSP CAS / Reset';
export const SET_HUB_DFSP_CAS_ERROR = 'HUB DFSP CAS / Set Root Cert Error';
export const SET_HUB_DFSP_CAS_CERTIFICATES = 'HUB DFSP CAS / Set Certificates';

export const SHOW_HUB_DFSP_CAS_ROOT_CERTIFICATE_MODAL = 'HUB DFSP CAS / Show Root Certificate Modal';
export const HIDE_HUB_DFSP_CAS_ROOT_CERTIFICATE_MODAL = 'HUB DFSP CAS / Hide Root Certificate Modal';
export const SHOW_HUB_DFSP_CAS_INTERMEDIATE_CHAIN_MODAL = 'HUB DFSP CAS / Show Intermediate Chain Modal';
export const HIDE_HUB_DFSP_CAS_INTERMEDIATE_CHAIN_MODAL = 'HUB DFSP CAS / Hide Intermediate Chain Modal';

export const resetHubDfspCas = createAction(RESET_HUB_DFSP_CAS);
export const setHubDfspCasError = createAction(SET_HUB_DFSP_CAS_ERROR);
export const setHubDfspCasCertificates = createAction(SET_HUB_DFSP_CAS_CERTIFICATES);
export const showHubDfspCasRootCertificateModal = createAction(SHOW_HUB_DFSP_CAS_ROOT_CERTIFICATE_MODAL);
export const hideHubDfspCasRootCertificateModal = createAction(HIDE_HUB_DFSP_CAS_ROOT_CERTIFICATE_MODAL);
export const showHubDfspCasIntermediateChainModal = createAction(SHOW_HUB_DFSP_CAS_INTERMEDIATE_CHAIN_MODAL);
export const hideHubDfspCasIntermediateChainModal = createAction(HIDE_HUB_DFSP_CAS_INTERMEDIATE_CHAIN_MODAL);

export const storeHubDfspCas = () => async (dispatch, getState) => {
  const dfsps = getDfsps(getState());
  const results = await Promise.all(dfsps.map(dfsp => dispatch(api.dfspCa.read({ dfspId: dfsp.id }))));
  const certificates = results.reduce((prev, curr, index) => {
    if (is200(curr.status) || is404(curr.status)) {
      prev.push({
        dfspId: dfsps[index].id,
        error: !is200(curr.status) && !is404(curr.status),
        rootCertificate: get(curr.data, 'rootCertificate'),
        intermediateChain: get(curr.data, 'intermediateChain'),
        validations: get(curr.data, 'validations'),
        validationState: get(curr.data, 'validationState'),
      });
    } else {
      prev.push({
        dfspId: dfsps[index].id,
        error: true,
        rootCertificate: null,
        intermediateChain: null,
        validations: null,
        validationState: null,
      });
    }
    return prev;
  }, []);

  if (certificates.length === 0) {
    dispatch(setHubDfspCasError('Generic'));
  }

  dispatch(setHubDfspCasCertificates(certificates));
};

export const downloadHubDfspCaRootCertificate = ({ cert, dfspName }) => (dispatch, getState) => {
  downloadFile(cert, `${dfspName}-root.pem`);
};

export const downloadHubDfspCaIntermediateChain = ({ cert, dfspName }) => (dispatch, getState) => {
  downloadFile(cert, `${dfspName}-intermediates.pem`);
};
