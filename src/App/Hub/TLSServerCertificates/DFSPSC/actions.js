import { createAction } from 'redux-actions';
import api from 'utils/api';
import { is200, is404 } from 'utils/http';
import { downloadFile } from 'utils/html';

export const RESET_HUB_DFSP_SC = 'HUB DFSP SC / Reset';
export const SET_HUB_DFSP_SC_ERROR = 'HUB DFSP SC / Set Root Cert Error';
export const SET_HUB_DFSP_SC_CERTIFICATES = 'HUB DFSP SC / Set Certificates';
export const SHOW_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL = 'HUB DFSP SC / Show Root Certificate Modal';
export const HIDE_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL = 'HUB DFSP SC / Hide Root Certificate Modal';
export const SHOW_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL = 'HUB DFSP SC / Show Intermediate Chain Modal';
export const HIDE_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL = 'HUB DFSP SC / Hide Intermediate Chain Modal';
export const SHOW_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL = 'HUB DFSP SC / Show Server Certificate Modal';
export const HIDE_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL = 'HUB DFSP SC / Hide Server Certificate Modal';

export const resetHubDfspSCs = createAction(RESET_HUB_DFSP_SC);
export const setHubDfspSCError = createAction(SET_HUB_DFSP_SC_ERROR);
export const setHubDfspSCCertificates = createAction(SET_HUB_DFSP_SC_CERTIFICATES);
export const showHubDfspSCRootCertificateModal = createAction(SHOW_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL);
export const hideHubDfspSCRootCertificateModal = createAction(HIDE_HUB_DFSP_SC_ROOT_CERTIFICATE_MODAL);
export const showHubDfspSCIntermediateChainModal = createAction(SHOW_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL);
export const hideHubDfspSCIntermediateChainModal = createAction(HIDE_HUB_DFSP_SC_INTERMEDIATE_CHAIN_MODAL);
export const showHubDfspSCServerCertificateModal = createAction(SHOW_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL);
export const hideHubDfspSCServerCertificateModal = createAction(HIDE_HUB_DFSP_SC_SERVER_CERTIFICATE_MODAL);

export const storeHubDfspSCServerCertificates = () => async (dispatch) => {
  const { data, status } = await dispatch(api.dfspsServerCerts.read());
  if (is200(status) || is404(status)) {
    dispatch(setHubDfspSCCertificates(data));
  } else {
    dispatch(setHubDfspSCError('Generic'));
  }
};

export const downloadHubDfspSCRootCertificate = ({ cert, dfspName }) => {
  downloadFile(cert, `${dfspName}-root.pem`);
};

export const downloadHubDfspSCIntermediateChain = ({ cert, dfspName }) => {
  downloadFile(cert, `${dfspName}-intermediates.pem`);
};

export const downloadHubDfspSCServerCertificate = ({ cert, dfspName }) => {
  downloadFile(cert, `${dfspName}-server.pem`);
};
