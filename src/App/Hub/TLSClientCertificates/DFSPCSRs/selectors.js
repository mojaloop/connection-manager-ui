import { createSelector } from 'reselect';
import find from 'lodash/find';
import {
  createPendingSelector,
  createPendingCollectionSelector,
  getPendingByParameter,
} from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import { getIsValid, toValidationResult } from '@modusbox/modusbox-ui-components/dist/redux-validation';
import { getDfsps } from 'App/selectors';
import { getHubExternalCaCertificates } from '../../CertificateAuthorities/HUBExternalCertificateAuthority/selectors';
import { getHubDfspCsrsCertificateModalUploadValidation } from './validators';
import { STATES } from '../constants';

export const getHubDfspCsrsError = state => state.hub.tls.client.dfsps.hubDfspCsrsError;
export const getHubDfspCsrsFilter = state => state.hub.tls.client.dfsps.hubDfspCsrsFilter;
export const getHubDfspCsrsCertificates = state => state.hub.tls.client.dfsps.hubDfspCsrsCertificates;
export const getIsHubDfspCsrsCertificateModalVisible = state =>
  state.hub.tls.client.dfsps.isHubDfspCsrsCertificateModalVisible;
export const getHubDfspCsrsCertificateModalContent = state =>
  state.hub.tls.client.dfsps.hubDfspCsrsCertificateModalContent;
export const getHubDfspCsrsCertificateModalTitle = state => state.hub.tls.client.dfsps.hubDfspCsrsCertificateModalTitle;

export const getHubHasUnsignedDfspCsrs = createSelector(
  getHubDfspCsrsCertificates,
  csrs => csrs.filter(csr => [STATES.CSR_LOADED].includes(csr.state)).length > 0
);

const findCaById = (id, cas) => find(cas, { id });

const getHubDfspCsrsCertificatesByDfsp = createSelector(
  getHubDfspCsrsCertificates,
  getDfsps,
  getHubExternalCaCertificates,
  (csrs, dfsps, cas) =>
    csrs.map(csr => {
      const dfsp = find(dfsps, { id: csr.dfspId });
      return {
        ...csr,
        dfspName: dfsp.name,
        externalCa: findCaById(csr.hubCAId, cas),
      };
    })
);

export const getFilteredHubDfspCsrsCertificatesByDFSP = createSelector(
  getHubDfspCsrsCertificatesByDfsp,
  getHubDfspCsrsFilter,
  (csrs, filter) => csrs.filter(csr => csr.dfspName.toLowerCase().includes(filter.toLowerCase()))
);

export const getIsHubDfspCsrsPending = createPendingSelector('inboundEnrollments.read');
const getHubDfspCASigningPendingCollection = createPendingCollectionSelector('inboundEnrollmentSign.create');
export const getIsHubDfspCertificateSigningPending = createPendingSelector('inboundEnrollmentCertificate.create');

const buildPendingByEnrollment = (csrs, collection) => {
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
};

export const getHubDfspCsrsCertificateUploadModalCertificate = state =>
  state.hub.tls.client.dfsps.hubDfspCsrsCertificateUploadModalCertificate;
export const getHubDfspCsrsCertificateUploadModalHubCaId = state =>
  state.hub.tls.client.dfsps.hubDfspCsrsCertificateUploadModalHubCaId;
export const getIsHubDfspCsrsCertificateUploadModalVisible = state =>
  state.hub.tls.client.dfsps.isHubDfspCsrsCertificateUploadModalVisible;
export const getHubDfspCsrsCertificateUploadModalDfspId = state =>
  state.hub.tls.client.dfsps.hubDfspCsrsCertificateUploadModalDfspId;
export const getHubDfspCsrsCertificateUploadModalEnrollmentId = state =>
  state.hub.tls.client.dfsps.hubDfspCsrsCertificateUploadModalEnrollmentId;

export const getHubDfspCsrsCertificateUploadModalCas = createSelector(
  state => state.hub.ca.external.hubExternalCertificates,
  caCertificates =>
    caCertificates.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
);

const buildCertificateUploadModel = (certificate, hubCAId) => ({ certificate, hubCAId });

export const getHubDfspCsrsCertificateModalUploadModel = createSelector(
  getHubDfspCsrsCertificateUploadModalCertificate,
  getHubDfspCsrsCertificateUploadModalHubCaId,
  buildCertificateUploadModel
);

export const getHubDfspCsrsCertificateModalUploadValidationResult = createSelector(
  getHubDfspCsrsCertificateModalUploadModel,
  getHubDfspCsrsCertificateModalUploadValidation,
  (m, v) => toValidationResult(m, v)
);

const getIsHubDfspCsrsCertificateModalUploadValid = createSelector(
  getHubDfspCsrsCertificateModalUploadValidationResult,
  getIsValid
);

export const getHubDfspCsrsIsCertificateUploadModalSubmitPending = createPendingSelector(
  'inboundEnrollmentCertificate.create'
);

export const getHubDfspCsrsIsCertificateUploadModalSubmitEnabled = createSelector(
  getIsHubDfspCsrsCertificateModalUploadValid,
  getHubDfspCsrsIsCertificateUploadModalSubmitPending,
  (isValid, isPending) => isValid && !isPending
);

export const getIsHubDfspCASigningPendingByEnrollmentId = createSelector(
  getFilteredHubDfspCsrsCertificatesByDFSP,
  getHubDfspCASigningPendingCollection,
  buildPendingByEnrollment
);
