import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { toValidationResult, getIsValid } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import * as testers from 'utils/testers';
import { getHubExternalCaValidators } from './validators';

export const getHubExternalCaError = state => state.hub.ca.external.hubExternalCaError;
export const getHubExternalCaCertificate = state => state.hub.ca.external.hubExternalCertificate;
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
  getHubExternalCaCertificate,
  certificate => certificate !== undefined
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
  getHubExternalCaCertificate,
  // TODO: Need to refactor this logic. Since CA's are now overwritten
  //       Since a participant can only have one, just return true.
  //       This used to check that a CA's name was unique.
  (name, certificates) => true
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
