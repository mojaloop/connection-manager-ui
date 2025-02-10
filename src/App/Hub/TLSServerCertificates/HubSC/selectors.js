import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import * as testers from 'utils/testers';

export const getHubSCError = state => state.hub.tls.server.hub.hubSCError;
export const getPreviousHubSCRootCertificate = state => state.hub.tls.server.hub.previousHubSCRootCertificate;
export const getPreviousHubSCIntermediateChain = state => state.hub.tls.server.hub.previousHubSCIntermediateChain;
export const getPreviousHubSCServerCertificate = state => state.hub.tls.server.hub.previousHubSCServerCertificate;
export const getHubSCRootCertificate = state => state.hub.tls.server.hub.hubSCRootCertificate;
export const getHubSCIntermediateChain = state => state.hub.tls.server.hub.hubSCIntermediateChain;
export const getHubSCServerCertificate = state => state.hub.tls.server.hub.hubSCServerCertificate;
export const getHubSCRootCertificateInfo = state => state.hub.tls.server.hub.hubSCRootCertificateInfo;
export const getHubSCIntermediateChainInfo = state => state.hub.tls.server.hub.hubSCIntermediateChainInfo;
export const getHubSCServerCertificateInfo = state => state.hub.tls.server.hub.hubSCServerCertificateInfo;
export const getHubSCValidations = state => state.hub.tls.server.hub.hubSCValidations;
export const getHubSCValidationState = state => state.hub.tls.server.hub.hubSCValidationState;
export const getIsHubSCRootCertificateModalVisible = state =>
  state.hub.tls.server.hub.isHubSCRootCertificateModalVisible;
export const getIsHubSCIntermediateChainModalVisible = state =>
  state.hub.tls.server.hub.isHubSCIntermediateChainModalVisible;
export const getIsHubSCServerCertificateModalVisible = state =>
  state.hub.tls.server.hub.isHubSCServerCertificateModalVisible;

export const getIsHubSCPending = createPendingSelector('hubSC.create');

const buildHubSCModel = (rootCertificate, intermediateChain, serverCertificate) => ({
  rootCertificate,
  intermediateChain,
  serverCertificate,
});
const getPreviousHubSCModel = createSelector(
  getPreviousHubSCRootCertificate,
  getPreviousHubSCIntermediateChain,
  getPreviousHubSCServerCertificate,
  buildHubSCModel
);
export const getHubSCModel = createSelector(
  getHubSCRootCertificate,
  getHubSCIntermediateChain,
  getHubSCServerCertificate,
  buildHubSCModel
);
const getIsHubSCModelChanged = createSelector(
  getPreviousHubSCModel,
  getHubSCModel,
  testers.isNotEqual
);
const getIsHubSCServerCertificateValid = createSelector(
  getHubSCServerCertificate,
  testers.isNotNil
);

export const getIsHubSCEditingExisitingModel = createSelector(
  getPreviousHubSCServerCertificate,
  testers.isNotNil
);
export const getIsHubSCSubmitEnabled = createSelector(
  getIsHubSCServerCertificateValid,
  getIsHubSCModelChanged,
  testers.getAllAre(true)
);

export const getIsHubSCCreatePending = createPendingSelector('hubServerCerts.create');
export const getIsHubSCUpdatePending = createPendingSelector('hubServerCerts.update');
export const getIsHubSCSubmitPending = createSelector(
  getIsHubSCCreatePending,
  getIsHubSCUpdatePending,
  testers.getAnyIs(true)
);
