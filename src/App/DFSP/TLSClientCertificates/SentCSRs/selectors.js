import { createSelector } from 'reselect';
import find from 'lodash/find';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getDfspHubExternalCaCertificate } from '../../CertificateAuthorities/HUBExternalCertificateAuthority/selectors';

export const getDfspSentCsrsError = state => state.dfsp.tls.client.csrs.dfspSentCsrsError;
export const getDfspSentCsrsFilter = state => state.dfsp.tls.client.csrs.dfspSentCsrsFilter;
export const getDfspSentCsrsCertificates = state => state.dfsp.tls.client.csrs.dfspSentCsrsCertificates;
export const getIsDfspSentCsrsCertificateModalVisible = state =>
  state.dfsp.tls.client.csrs.isDfspSentCsrsCertificateModalVisible;
export const getDfspSentCsrsCertificateModalContent = state =>
  state.dfsp.tls.client.csrs.dfspSentCsrsCertificateModalContent;
export const getDfspSentCsrsCertificateModalTitle = state =>
  state.dfsp.tls.client.csrs.dfspSentCsrsCertificateModalTitle;

const findCaById = (id, cas) => find(cas, { id });

export const getFilteredDfspSentCsrsCertificates = createSelector(
  getDfspHubExternalCaCertificate,
  getDfspSentCsrsCertificates,
  getDfspSentCsrsFilter,
  (cas, certificates, filter) => {
    const lowerCaseFilter = filter.toLowerCase();
    return certificates
      .map(csr => ({
        ...csr,
        externalCa: findCaById(csr.hubCAId, cas),
      }))
      .filter(csr => csr.csrInfo.subject.CN.toLowerCase().includes(lowerCaseFilter));
  }
);

export const getIsDfspSentCsrsPending = createPendingSelector('inboundEnrollments.read');
