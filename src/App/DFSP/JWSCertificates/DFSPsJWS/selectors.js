import { createSelector } from 'reselect';
import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';
import find from 'lodash/find';
import { getOtherDfsps } from 'App/DFSP/selectors';

export const getDfspsJWSError = state => state.dfsp.jws.dfsps.dfspsJWSError;
export const getDfspsJWSFilter = state => state.dfsp.jws.dfsps.dfspsJWSFilter;
export const getDfspsJWSCertificates = state => state.dfsp.jws.dfsps.dfspsJWSCertificates;
export const getDfspsJWSJwsCertificateModalContent = state => state.dfsp.jws.dfsps.dfspsJWSJwsCertificateModalContent;
export const getIsDfspsJWSJwsCertificateModalVisible = state =>
  state.dfsp.jws.dfsps.isDfspsJWSJwsCertificateModalVisible;
export const getDfspsJWSIntermediateChainModalContent = state =>
  state.dfsp.jws.dfsps.dfspsJWSIntermediateChainModalContent;
export const getIsDfspsJWSIntermediateChainModalVisible = state =>
  state.dfsp.jws.dfsps.isDfspsJWSIntermediateChainModalVisible;

export const getIsDfspsJWSPending = createPendingSelector('dfspsJWSCerts.read');

const getDfspCertificatesByDfsp = createSelector(
  getDfspsJWSCertificates,
  getOtherDfsps,
  (certificates, otherDfsps) => {
    return otherDfsps.map(dfsp => {
      const certificate = find(certificates, { dfspId: dfsp.id });
      return {
        ...certificate,
        dfspId: dfsp.id,
        dfspName: dfsp.name,
      };
    });
  }
);

export const getFilteredDfspsJWSCertificatesByDfsp = createSelector(
  getDfspCertificatesByDfsp,
  getDfspsJWSFilter,
  (certificates, filter) => {
    const lowerCaseFilter = filter.toLowerCase();
    return certificates.filter(csr => csr.dfspName.toLowerCase().includes(lowerCaseFilter));
  }
);
