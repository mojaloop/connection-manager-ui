import { createSelector } from 'reselect';
import * as testers from 'utils/testers';
import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';
import { getIsValid, toValidationResult, validate } from 'modusbox-ui-components/dist/redux-validation';
import { getDfsps } from 'App/selectors';
import { getIsHubCaMissing } from 'App/Hub/CertificateAuthorities/HUBCertificateAuthority/selectors';
import { getHubSentCsrsCertificates } from 'App/Hub/TLSClientCertificates/SentCSRs/selectors';
import { getHubCsrSubjectValidation, getHubCsrDNSValidation, getHubCsrIPValidation } from './validators';
import { CSR_TYPES, buildCsrTypeOptions } from './constants';

export const getHubCsrDfspId = state => state.hub.tls.client.csr.hubCsrDfspId;
export const getHubCsrCertificate = state => state.hub.tls.client.csr.hubCsrCertificate;
export const getHubCsrCsrType = state => state.hub.tls.client.csr.hubCsrCsrType;
export const getHubCsrCommonName = state => state.hub.tls.client.csr.hubCsrCommonName;
export const getHubCsrOrganization = state => state.hub.tls.client.csr.hubCsrOrganization;
export const getHubCsrOrganizationUnit = state => state.hub.tls.client.csr.hubCsrOrganizationUnit;
export const getHubCsrEmail = state => state.hub.tls.client.csr.hubCsrEmail;
export const getHubCsrLocality = state => state.hub.tls.client.csr.hubCsrLocality;
export const getHubCsrCountry = state => state.hub.tls.client.csr.hubCsrCountry;
export const getHubCsrState = state => state.hub.tls.client.csr.hubCsrState;
export const getHubCsrDnss = state => state.hub.tls.client.csr.hubCsrDnss;
export const getHubCsrIps = state => state.hub.tls.client.csr.hubCsrIps;
export const getIsHubCsrModalVisible = state => state.hub.tls.client.csr.isHubCsrModalVisible;

export const getHubCsrDfspsOptions = createSelector(
  getDfsps,
  getHubSentCsrsCertificates,
  (dfsps, csrs) =>
    dfsps.map(dfsp => ({
      label: dfsp.name,
      value: dfsp.id,
      hasCsrs: csrs.some(csr => csr.dfspId === dfsp.id),
    }))
);

const getIsHubCsrsHubCaAvailable = createSelector(
  getIsHubCaMissing,
  isMissing => !isMissing
);

export const getCsrTypeOptions = createSelector(
  getIsHubCsrsHubCaAvailable,
  buildCsrTypeOptions
);

export const getHubCsrSubjectModel = createSelector(
  getHubCsrCommonName,
  getHubCsrEmail,
  getHubCsrOrganization,
  getHubCsrOrganizationUnit,
  getHubCsrLocality,
  getHubCsrCountry,
  getHubCsrState,
  (commonName, email, organization, organizationUnit, locality, country, state) => ({
    commonName,
    email,
    organization,
    organizationUnit,
    locality,
    country,
    state,
  })
);

export const getHubCsrManualModel = createSelector(
  getHubCsrSubjectModel,
  getHubCsrDnss,
  getHubCsrIps,
  (subject, dnss, ips) => ({
    subject: {
      CN: subject.commonName,
      emailAddress: subject.email,
      O: subject.organization,
      OU: subject.organizationUnit,
      ST: subject.state,
      C: subject.country,
      L: subject.locality,
    },
    extensions: {
      subjectAltName: {
        dns: dnss,
        ips: ips,
      },
    },
  })
);

export const getHubCsrSubjectValidationResult = createSelector(
  getHubCsrSubjectModel,
  getHubCsrSubjectValidation,
  toValidationResult
);
export const getHubCsrDnssValidationResult = createSelector(
  getHubCsrDnss,
  getHubCsrDNSValidation,
  (dnss, dnsValidation) => dnss.map(dns => validate(dns, dnsValidation))
);
export const getHubCsrIpsValidationResult = createSelector(
  getHubCsrIps,
  getHubCsrIPValidation,
  (ips, ipValidation) => ips.map(ip => validate(ip, ipValidation))
);

const getIsHubCsrSubjectValid = createSelector(
  getHubCsrSubjectValidationResult,
  getIsValid
);
const getIsHubCsrDnssValid = createSelector(
  getHubCsrDnssValidationResult,
  results => results.every(getIsValid)
);
const getIsHubCsrIpsValid = createSelector(
  getHubCsrIpsValidationResult,
  results => results.every(getIsValid)
);

const getIsHubCsrManualCertificateValid = createSelector(
  getIsHubCsrSubjectValid,
  getIsHubCsrDnssValid,
  getIsHubCsrIpsValid,
  testers.getAllAre(true)
);

const getIsHubCsrFileCertificateValid = createSelector(
  getHubCsrCertificate,
  testers.isNotNil
);

const getIsHubCsrFormValid = createSelector(
  getHubCsrCsrType,
  getIsHubCsrFileCertificateValid,
  getIsHubCsrManualCertificateValid,
  (type, isFileCertificateValid, isManualCertificateValid) => {
    if (type === CSR_TYPES.MANUAL) {
      return isManualCertificateValid;
    }
    return isFileCertificateValid;
  }
);

const getIsHubDfspIdDefined = createSelector(
  getHubCsrDfspId,
  testers.isNotNil
);

export const getIsHubCsrSubmitEnabled = createSelector(
  getIsHubDfspIdDefined,
  getIsHubCsrFormValid,
  testers.getAllAre(true)
);

const getIsHubCsrCreatePending = createPendingSelector('outboundEnrollments.create');
const getIsHubCsrManualCreatePending = createPendingSelector('outboundEnrollmentCsr.create');
export const getIsHubCsrSubmitPending = createSelector(
  getIsHubCsrCreatePending,
  getIsHubCsrManualCreatePending,
  testers.getAnyIs(true)
);
