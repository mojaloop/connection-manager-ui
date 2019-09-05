import { createSelector } from 'reselect';
import find from 'lodash/find';
import {
  createPendingSelector,
  createPendingCollectionSelector,
  getPendingByParameter,
} from 'modusbox-ui-components/dist/redux-fetch';
import { getDfsps } from 'App/selectors';
import { STATES } from '../constants';

export const getHubSentCsrsError = state => state.hub.tls.client.csrs.hubSentCsrsError;
export const getHubSentCsrsFilter = state => state.hub.tls.client.csrs.hubSentCsrsFilter;
export const getHubSentCsrsCertificates = state => state.hub.tls.client.csrs.hubSentCsrsCertificates;
export const getIsHubSentCsrsCertificateModalVisible = state =>
  state.hub.tls.client.csrs.isHubSentCsrsCertificateModalVisible;
export const getHubSentCsrsCertificateModalContent = state =>
  state.hub.tls.client.csrs.hubSentCsrsCertificateModalContent;
export const getHubSentCsrsCertificateModalTitle = state => state.hub.tls.client.csrs.hubSentCsrsCertificateModalTitle;

export const getHubHasUnvalidatedDfspCsrs = createSelector(
  getHubSentCsrsCertificates,
  csrs => csrs.filter(csr => [STATES.CERT_SIGNED].includes(csr.state)).length > 0
);

const getHubSentCsrsCertificatesByDfsp = createSelector(
  getHubSentCsrsCertificates,
  getDfsps,
  (csrs, dfsps) =>
    csrs.map(csr => {
      const dfsp = find(dfsps, { id: csr.dfspId });
      return {
        ...csr,
        dfspName: dfsp.name,
      };
    })
);

export const getFilteredHubSentCsrsCertificatesByDFSP = createSelector(
  getHubSentCsrsCertificatesByDfsp,
  getHubSentCsrsFilter,
  (csrs, filter) => csrs.filter(csr => csr.dfspName.toLowerCase().includes(filter.toLowerCase()))
);

export const getIsHubSentCsrsPending = createPendingSelector('outboundEnrollments.read');
export const getIsHubSentCsrsValidateCertificatePendingCollection = createPendingCollectionSelector(
  'outboundEnrollmentValidate.create'
);
export const getIsHubSentCsrsValidateCertificatePendingByDfspId = createSelector(
  getFilteredHubSentCsrsCertificatesByDFSP,
  getIsHubSentCsrsValidateCertificatePendingCollection,
  (csrs, collection) => {
    const getByCsrId = getPendingByParameter('enrollmentId');
    return csrs
      .map(csr => csr.id)
      .reduce(
        (prev, id) => ({
          ...prev,
          [id]: getByCsrId(collection, id),
        }),
        {}
      );
  }
);
