import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getIsValid, toValidationResult, validate } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import * as testers from 'utils/testers';
import { getHubCaNameValidation, getHubCaHostValidation } from './validators';

export const getHubCaError = state => state.hub.ca.hub.hubCaError;
export const getHubCaCommonName = state => state.hub.ca.hub.hubCaCommonName;
export const getHubCaOrganization = state => state.hub.ca.hub.hubCaOrganization;
export const getHubCaOrganizationUnit = state => state.hub.ca.hub.hubCaOrganizationUnit;
export const getHubCaLocality = state => state.hub.ca.hub.hubCaLocality;
export const getHubCaState = state => state.hub.ca.hub.hubCaState;
export const getHubCaCountry = state => state.hub.ca.hub.hubCaCountry;
export const getHubCaHosts = state => state.hub.ca.hub.hubCaHosts;
export const getHubCaRootCertificate = state => state.hub.ca.hub.hubCaRootCertificate;
export const getHubCaRootCertificateInfo = state => state.hub.ca.hub.hubCaRootCertificateInfo;
export const getIsHubCaModalVisible = state => state.hub.ca.hub.isHubCaModalVisible;

export const getIsHubCaPending = createPendingSelector('hubCa.create');

export const getIsHubCaMissing = createSelector(getHubCaRootCertificate, testers.isNil);

const buildCaModel = (commonName, organization, organizationUnit, locality, state, country) => ({
  commonName,
  organization,
  organizationUnit,
  locality,
  state,
  country,
});

const getHubCaNameModel = createSelector(
  getHubCaCommonName,
  getHubCaOrganization,
  getHubCaOrganizationUnit,
  getHubCaLocality,
  getHubCaState,
  getHubCaCountry,
  buildCaModel
);

export const getHubCaHostsValidationResult = createSelector(
  getHubCaHosts,
  getHubCaHostValidation,
  (hosts, hostValidation) => hosts.map(host => validate(host, hostValidation))
);

export const getHubCaModelValidationResult = createSelector(
  getHubCaNameModel,
  getHubCaNameValidation,
  toValidationResult
);

const getAreHubCaHostsValid = createSelector(getHubCaHostsValidationResult, results => results.every(getIsValid));

const getIsHubCaModelValid = createSelector(getHubCaModelValidationResult, getIsValid);
const getIsHubCaFormValid = createSelector(getIsHubCaModelValid, getAreHubCaHostsValid, testers.getAllAre(true));

export const getIsHubCaSubmitEnabled = createSelector(
  getIsHubCaFormValid,
  getHubCaRootCertificate,
  (isValid, hasCertificate) => isValid && !hasCertificate
);

export const getHubCaModel = createSelector(getHubCaNameModel, getHubCaHosts, (nameModel, hosts) => ({
  default: {
    expiry: '43800h',
    usages: ['signing', 'key encipherment', 'client auth'],
    signature_algorithm: 'SHA256WithRSA',
  },
  csr: {
    hosts,
    names: [
      {
        CN: nameModel.commonName,
        O: nameModel.organization,
        OU: nameModel.organizationUnit,
        C: nameModel.country,
        ST: nameModel.state,
        L: nameModel.locality,
      },
    ],
    key: {
      size: 4096,
      algo: 'rsa',
    },
  },
}));
