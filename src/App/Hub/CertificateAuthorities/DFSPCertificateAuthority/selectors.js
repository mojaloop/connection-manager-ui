import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import find from 'lodash/find';
import { getDfsps } from 'App/selectors';

export const getHubDfspCasError = state => state.hub.ca.dfsps.hubDfspCasError;
export const getHubDfspCasCertificates = state => state.hub.ca.dfsps.hubDfspCasCertificates;
export const getIsHubDfspCasRootCertificateModalVisible = state =>
  state.hub.ca.dfsps.isHubDfspCasRootCertificateModalVisible;
export const getIsHubDfspCasIntermediateChainModalVisible = state =>
  state.hub.ca.dfsps.isHubDfspCasIntermediateChainModalVisible;
export const getHubDfspCasRootCertificateModalContent = state =>
  state.hub.ca.dfsps.hubDfspCasRootCertificateModalContent;
export const getHubDfspCasIntermediateChainModalContent = state =>
  state.hub.ca.dfsps.hubDfspCasIntermediateChainModalContent;

export const getIsHubDfspCasPending = createPendingSelector('dfspCa.read');

export const getDfspCertificatesByDfsp = createSelector(getHubDfspCasCertificates, getDfsps, (certificates, dfsps) => {
  return dfsps.map(dfsp => {
    const certificate = find(certificates, { dfspId: dfsp.id });
    return {
      ...certificate,
      dfspName: dfsp.name,
    };
  });
});
