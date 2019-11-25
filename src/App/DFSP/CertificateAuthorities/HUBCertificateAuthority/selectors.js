import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
export const getDfspHubCaError = state => state.dfsp.ca.hub.dfspHubCaError;
export const getDfspHubCaRootCertificate = state => state.dfsp.ca.hub.dfspHubCaRootCertificate;
export const getIsDfspHubCaRootCertificateModalVisible = state =>
  state.dfsp.ca.hub.isDfspHubCaRootCertificateModalVisible;

export const getIsDfspHubCaPending = createPendingSelector('hubCa.read');
