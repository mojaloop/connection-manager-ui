import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';
export const getDfspHubSCError = state => state.dfsp.tls.server.hub.dfspHubSCError;
export const getDfspHubSCRootCertificate = state => state.dfsp.tls.server.hub.dfspHubSCRootCertificate;
export const getDfspHubSCIntermediateChain = state => state.dfsp.tls.server.hub.dfspHubSCIntermediateChain;
export const getDfspHubSCServerCertificate = state => state.dfsp.tls.server.hub.dfspHubSCServerCertificate;
export const getDfspHubSCRootCertificateInfo = state => state.dfsp.tls.server.hub.dfspHubSCRootCertificateInfo;
export const getDfspHubSCIntermediateChainInfo = state => state.dfsp.tls.server.hub.dfspHubSCIntermediateChainInfo;
export const getDfspHubSCServerCertificateInfo = state => state.dfsp.tls.server.hub.dfspHubSCServerCertificateInfo;
export const getDfspHubSCValidations = state => state.dfsp.tls.server.hub.dfspHubSCValidations;
export const getDfspHubSCValidationState = state => state.dfsp.tls.server.hub.dfspHubSCValidationState;
export const getIsDfspHubSCRootCertificateModalVisible = state =>
  state.dfsp.tls.server.hub.isDfspHubSCRootCertificateModalVisible;
export const getIsDfspHubSCIntermediateChainModalVisible = state =>
  state.dfsp.tls.server.hub.isDfspHubSCIntermediateChainModalVisible;
export const getIsDfspHubSCServerCertificateModalVisible = state =>
  state.dfsp.tls.server.hub.isDfspHubSCServerCertificateModalVisible;
export const getIsDfspHubSCPending = createPendingSelector('hubServerCerts.read');
