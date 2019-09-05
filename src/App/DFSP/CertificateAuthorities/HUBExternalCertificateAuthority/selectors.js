import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';

export const getDfspHubExternalCaError = state => state.dfsp.ca.hubExternal.dfspHubExternalCaError;
export const getDfspHubExternalCaCertificates = state => state.dfsp.ca.hubExternal.dfspHubExternalCertificates;
export const getIsDfspHubExternalCaRootCertificateModalVisible = state =>
  state.dfsp.ca.hubExternal.isDfspHubExternalCaRootCertificateModalVisible;
export const getIsDfspHubExternalCaIntermediateChainModalVisible = state =>
  state.dfsp.ca.hubExternal.isDfspHubExternalCaIntermediateChainModalVisible;
export const getDfspHubExternalCaRootCertificateModalContent = state =>
  state.dfsp.ca.hubExternal.dfspHubExternalCaRootCertificateModalContent;
export const getDfspHubExternalCaIntermediateChainModalContent = state =>
  state.dfsp.ca.hubExternal.dfspHubExternalCaIntermediateChainModalContent;

export const getIsDfspHubExternalCaReadPending = createPendingSelector('hubExternalCas.read');
