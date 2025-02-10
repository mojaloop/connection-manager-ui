import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';

export const getDfspHubExternalCaError = state => state.dfsp.ca.hubExternal.dfspHubExternalCaError;
export const getDfspHubExternalCaCertificate = state => state.dfsp.ca.hubExternal.dfspHubExternalCertificate;
export const getIsDfspHubExternalCaRootCertificateModalVisible = state =>
  state.dfsp.ca.hubExternal.isDfspHubExternalCaRootCertificateModalVisible;
export const getIsDfspHubExternalCaIntermediateChainModalVisible = state =>
  state.dfsp.ca.hubExternal.isDfspHubExternalCaIntermediateChainModalVisible;
export const getDfspHubExternalCaRootCertificateModalContent = state =>
  state.dfsp.ca.hubExternal.dfspHubExternalCaRootCertificateModalContent;
export const getDfspHubExternalCaIntermediateChainModalContent = state =>
  state.dfsp.ca.hubExternal.dfspHubExternalCaIntermediateChainModalContent;

export const getIsDfspHubExternalCaReadPending = createPendingSelector('hubExternalCas.read');
