import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { validate, getIsValid } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import * as testers from 'utils/testers';
import { STATES } from '../constants';
import { getIngressUrlValidation, getIngressAddressValidation, getIngressPortValidation } from './validators';

export const getPreviousIngressUrls = state => state.dfsp.endpoints.dfsp.ingress.previousIngressUrls;
export const getPreviousIngressIps = state => state.dfsp.endpoints.dfsp.ingress.previousIngressIps;
export const getIngressUrls = state => state.dfsp.endpoints.dfsp.ingress.ingressUrls;
export const getIngressIps = state => state.dfsp.endpoints.dfsp.ingress.ingressIps;
export const getIngressUrlsError = state => state.dfsp.endpoints.dfsp.ingress.ingressUrlsError;
export const getIngressIpsError = state => state.dfsp.endpoints.dfsp.ingress.ingressIpsError;

export const getIngressError = createSelector(getIngressUrlsError, getIngressIpsError, testers.getAnyIsDefined);

export const getIngressUrlsValidationResult = createSelector(
  getIngressUrls,
  getIngressUrlValidation,
  (urls, urlValidation) => urls.map(({ url }) => validate(url, urlValidation))
);

export const getIngressIpsValidationResult = createSelector(
  getIngressIps,
  getIngressAddressValidation,
  getIngressPortValidation,
  (ips, addressValidation, portValidation) =>
    ips.map(({ address, ports }) => ({
      address: validate(address, addressValidation),
      ports: ports.map(port => validate(port, portValidation)),
    }))
);

export const getIsIngressUrlsValid = createSelector(getIngressUrlsValidationResult, results =>
  results.every(getIsValid)
);

export const getIsIngressIpsValid = createSelector(getIngressIpsValidationResult, results =>
  results.every(result => getIsValid(result.address) && result.ports.every(getIsValid))
);

const getIsIngressUrlsChanged = createSelector(getPreviousIngressUrls, getIngressUrls, testers.isNotEqual);

const getIsIngressIpsChanged = createSelector(getPreviousIngressIps, getIngressIps, testers.isNotEqual);

export const getIsIngressChanged = createSelector(
  getIsIngressUrlsChanged,
  getIsIngressIpsChanged,
  testers.getAnyIs(true)
);

export const getIsIngressSubmitEnabled = createSelector(
  getIsIngressUrlsValid,
  getIsIngressIpsValid,
  getIsIngressChanged,
  testers.getAllAre(true)
);

export const getIsIngressIpsReadPending = createPendingSelector('ingressIps.read');
export const getIsIngressUrlsReadPending = createPendingSelector('ingressUrls.read');
const getIsIngressUrlCreatePending = createPendingSelector('ingressUrls.create');
const getIsIngressUrlEditPending = createPendingSelector('ingressUrl.update');
const getIsIngressIpCreatePending = createPendingSelector('ingressIps.create');
const getIsIngressIpEditPending = createPendingSelector('ingressIp.update');
const getIsIngressIpDeletePending = createPendingSelector('ingressIp.delete');

export const getIsIngressPending = createSelector(
  getIsIngressIpsReadPending,
  getIsIngressUrlsReadPending,
  testers.getAnyIs(true)
);
export const getIsIngressSubmitPending = createSelector(
  getIsIngressUrlCreatePending,
  getIsIngressUrlEditPending,
  getIsIngressIpCreatePending,
  getIsIngressIpEditPending,
  getIsIngressIpDeletePending,
  testers.getAnyIs(true)
);

export const getIpsOperations = createSelector(getIngressIps, getPreviousIngressIps, (ips, previousIps) => ({
  create: ips.filter(ip => ip.state === STATES.UNSET),
  update: ips.filter(ip => ip.state !== STATES.UNSET).filter(ip => !isEqual(find(previousIps, { id: ip.id }), ip)),
  delete: previousIps.filter(ip => !find(ips, { id: ip.id })),
}));

export const getUrlsOperations = createSelector(getIngressUrls, getPreviousIngressUrls, (urls, previousUrls) => ({
  create: urls.filter(url => url.state === STATES.UNSET),
  update: urls
    .filter(url => url.state !== STATES.UNSET)
    .filter(url => !isEqual(find(previousUrls, { id: url.id }), url)),
  delete: previousUrls.filter(url => !find(urls, { id: url.id })),
}));
