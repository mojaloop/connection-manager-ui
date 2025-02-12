import { createSelector } from 'reselect';
import find from 'lodash/find';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getDfspMonetaryZoneId } from 'App/selectors';
import { getOtherDfsps } from 'App/DFSP/selectors';

export const getDfspsJWSError = state => state.dfsp.jws.dfsps.dfspsJWSError;
export const getDfspsJWSFilter = state => state.dfsp.jws.dfsps.dfspsJWSFilter;
export const getDfspsJWSSameMonetaryZone = state => state.dfsp.jws.dfsps.dfspsSameMonetaryZone;
export const getDfspsJWSCertificates = state => state.dfsp.jws.dfsps.dfspsJWSCertificates;
export const getDfspsJWSJwsCertificateModalContent = state => state.dfsp.jws.dfsps.dfspsJWSJwsCertificateModalContent;
export const getIsDfspsJWSJwsCertificateModalVisible = state =>
  state.dfsp.jws.dfsps.isDfspsJWSJwsCertificateModalVisible;
export const getDfspsJWSIntermediateChainModalContent = state =>
  state.dfsp.jws.dfsps.dfspsJWSIntermediateChainModalContent;
export const getIsDfspsJWSIntermediateChainModalVisible = state =>
  state.dfsp.jws.dfsps.isDfspsJWSIntermediateChainModalVisible;

export const getIsDfspsJWSPending = createPendingSelector('dfspsJWSCerts.read');
export const getIsSameMonetaryZoneFilterEnabled = createSelector(
  getDfspMonetaryZoneId,
  monetaryZoneId => monetaryZoneId !== undefined
);

const getDfspCertificatesByDfsp = createSelector(
  getDfspsJWSCertificates,
  getOtherDfsps,
  getDfspMonetaryZoneId,
  (certificates, otherDfsps, monetaryZoneId) => {
    return otherDfsps.map(dfsp => {
      const certificate = find(certificates, { dfspId: dfsp.id });
      return {
        ...certificate,
        dfspId: dfsp.id,
        dfspName: dfsp.name,
        dfspMonetaryZone: dfsp.monetaryZoneId,
        isDownloadEnabled: dfsp.monetaryZoneId === monetaryZoneId || !monetaryZoneId,
      };
    });
  }
);

export const getFilteredDfspsJWSCertificatesByDfsp = createSelector(
  getDfspCertificatesByDfsp,
  getDfspsJWSFilter,
  getDfspsJWSSameMonetaryZone,
  getDfspMonetaryZoneId,
  (certificates, filter, filterBySameZone, zoneId) => {
    const lowerCaseFilter = filter.toLowerCase();
    return certificates
      .filter(cert => cert.dfspName.toLowerCase().includes(lowerCaseFilter))
      .filter(cert => {
        if (filterBySameZone) {
          return cert.dfspMonetaryZone === zoneId;
        }
        return true;
      });
  }
);
