import { createSelector } from 'reselect';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import { toValidationResult, getIsValid } from '@modusbox/modusbox-ui-components/dist/redux-validation';
import * as testers from 'utils/testers';
import { getHubExternalCaValidators } from './validators';

export const getHubExternalCaError = state => state.hub.ca.external.hubExternalCaError;
export const getHubExternalCaCertificates = state => state.hub.ca.external.hubExternalCertificates;
export const getHubExternalCaRootCertificate = state => state.hub.ca.external.hubExternalCaRootCert;
export const getHubExternalCaIntermediateChain = state => state.hub.ca.external.hubExternalCaIntermediateChain;
export const getHubExternalCaName = state => state.hub.ca.external.hubExternalCaName;
export const getIsHubExternalCaRootCertificateModalVisible = state =>
  state.hub.ca.external.isHubExternalCaRootCertificateModalVisible;
export const getIsHubExternalCaIntermediateChainModalVisible = state =>
  state.hub.ca.external.isHubExternalCaIntermediateChainModalVisible;
export const getHubExternalCaRootCertificateModalContent = state =>
  state.hub.ca.external.hubExternalCaRootCertificateModalContent;
export const getHubExternalCaIntermediateChainModalContent = state =>
  state.hub.ca.external.hubExternalCaIntermediateChainModalContent;

export const getIsHubExternalCasMissing = createSelector(
  getHubExternalCaCertificates,
  certificates => certificates.length === 0
);

const buildHubExternalCaModel = (rootCertificate, intermediateChain, name) => ({
  rootCertificate,
  intermediateChain,
  name,
});

export const getHubExternalCaModel = createSelector(
  getHubExternalCaRootCertificate,
  getHubExternalCaIntermediateChain,
  getHubExternalCaName,
  buildHubExternalCaModel
);

const getHubExternalCaNameInUniq = createSelector(
  getHubExternalCaName,
  getHubExternalCaCertificates,
  (name, certificates) => certificates.every(certificate => certificate.name !== name)
);

const getHubExternalCaValidation = createSelector(
  getHubExternalCaName,
  getHubExternalCaNameInUniq,
  getHubExternalCaRootCertificate,
  getHubExternalCaIntermediateChain,
  getHubExternalCaValidators
);

export const getHubExternalCaValidationResult = createSelector(
  getHubExternalCaModel,
  getHubExternalCaValidation,
  toValidationResult
);

const getIsHubCaModelValid = createSelector(
  getHubExternalCaValidationResult,
  getIsValid
);

export const getIsHubExternalCaReadPending = createPendingSelector('hubExternalCas.read');
export const getIsHubExternalCaCreatePending = createPendingSelector('hubExternalCas.create');

export const getIsSubmitPending = createSelector(
  getIsHubExternalCaCreatePending,
  testers.getAllAre(true)
);
export const getIsSubmitEnabled = createSelector(
  getIsHubCaModelValid,
  getIsHubExternalCaReadPending,
  (isValid, isReading) => isValid && !isReading
);
