import { createSelector } from 'reselect';

import {
  createPendingSelector,
  createPendingCollectionSelector,
  getPendingByParameter,
} from 'modusbox-ui-components/dist/redux-fetch';
import { STATES } from '../constants';

export const getDfspHubCsrsError = state => state.dfsp.tls.client.hub.dfspHubCsrsError;
export const getDfspHubCsrsCertificates = state => state.dfsp.tls.client.hub.dfspHubCsrsCertificates;
export const getIsDfspHubCsrsCertificateModalVisible = state =>
  state.dfsp.tls.client.hub.isDfspHubCsrsCertificateModalVisible;
export const getDfspHubCsrsCertificateModalContent = state =>
  state.dfsp.tls.client.hub.dfspHubCsrsCertificateModalContent;
export const getDfspHubCsrsCertificateModalTitle = state => state.dfsp.tls.client.hub.dfspHubCsrsCertificateModalTitle;

export const getDfspHasUnsignedHubCsrs = createSelector(
  getDfspHubCsrsCertificates,
  csrs => csrs.filter(csr => [STATES.CSR_LOADED].includes(csr.state)).length > 0
);

export const getIsDfspHubCsrsPending = createPendingSelector('outboundEnrollments.read');
export const getDfspHubCsrCertificateSigningPendingCollection = createPendingCollectionSelector(
  'outboundEnrollmentCertificate.create'
);
export const getIsDfspHubCsrCertificateSigningPendingByEnrollmentId = createSelector(
  getDfspHubCsrsCertificates,
  getDfspHubCsrCertificateSigningPendingCollection,
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
