import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';
export const getDfspCaError = state => state.dfsp.ca.dfsp.dfspCaError;
export const getDfspCaRootCertificate = state => state.dfsp.ca.dfsp.dfspCaRootCert;
export const getDfspCaIntermediateChain = state => state.dfsp.ca.dfsp.dfspCaIntermediateChain;
export const getDfspCaValidations = state => state.dfsp.ca.dfsp.dfspCaValidations;
export const getDfspCaValidationState = state => state.dfsp.ca.dfsp.dfspCaValidationState;
export const getIsDfspCaRootCertificateModalVisible = state => state.dfsp.ca.dfsp.isDfspCaRootCertificateModalVisible;
export const getIsDfspCaIntermediateChainModalVisible = state =>
  state.dfsp.ca.dfsp.isDfspCaIntermediateChainModalVisible;

export const getIsDfspCaPending = createPendingSelector('dfspCa.create');
