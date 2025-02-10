import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import find from 'lodash/find';
import { getDfsps } from 'App/selectors';

export const getHubDfspSCError = state => state.hub.tls.server.dfsps.hubDfspSCError;
export const getHubDfspSCCertificates = state => state.hub.tls.server.dfsps.hubDfspSCCertificates;
export const getHubDfspSCRootCertificateModalContent = state =>
  state.hub.tls.server.dfsps.hubDfspSCRootCertificateModalContent;
export const getIsHubDfspSCRootCertificateModalVisible = state =>
  state.hub.tls.server.dfsps.isHubDfspSCRootCertificateModalVisible;
export const getHubDfspSCIntermediateChainModalContent = state =>
  state.hub.tls.server.dfsps.hubDfspSCIntermediateChainModalContent;
export const getIsHubDfspSCIntermediateChainModalVisible = state =>
  state.hub.tls.server.dfsps.isHubDfspSCIntermediateChainModalVisible;
export const getHubDfspSCServerCertificateModalContent = state =>
  state.hub.tls.server.dfsps.hubDfspSCServerCertificateModalContent;
export const getIsHubDfspSCServerCertificateModalVisible = state =>
  state.hub.tls.server.dfsps.isHubDfspSCServerCertificateModalVisible;

export const getIsHubDfspSCPending = createPendingSelector('dfspsServerCerts.read');

export const getDfspCertificatesByDfsp = createSelector(
  getHubDfspSCCertificates,
  getDfsps,
  (certificates, dfsps) => {
    return dfsps.map(dfsp => {
      const certificate = find(certificates, { dfspId: dfsp.id });
      return {
        ...certificate,
        dfspId: dfsp.id,
        dfspName: dfsp.name,
      };
    });
  }
);
