import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { validate, getIsValid } from 'modusbox-ui-components/dist/redux-validation';
import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';
import * as testers from 'utils/testers';
import { STATES } from '../constants';
import { getIngressUrlValidation, getIngressAddressValidation, getIngressPortValidation } from './validators';

export const getPreviousIngressUrls = state => state.hub.endpoints.ingress.previousIngressUrls;
export const getPreviousIngressIps = state => state.hub.endpoints.ingress.previousIngressIps;
export const getIngressUrls = state => state.hub.endpoints.ingress.ingressUrls;
export const getIngressIps = state => state.hub.endpoints.ingress.ingressIps;
export const getIngressUrlsError = state => state.hub.endpoints.ingress.ingressUrlsError;
export const getIngressIpsError = state => state.hub.endpoints.ingress.ingressIpsError;

export const getIngressError = createSelector(
  getIngressUrlsError,
  getIngressIpsError,
  testers.getAnyIsDefined
);

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

export const getIsIngressUrlsValid = createSelector(
  getIngressUrlsValidationResult,
  results => results.every(getIsValid)
);

export const getIsIngressIpsValid = createSelector(
  getIngressIpsValidationResult,
  results => results.every(result => getIsValid(result.address) && result.ports.every(getIsValid))
);

const getIsIngressUrlsChanged = createSelector(
  getPreviousIngressUrls,
  getIngressUrls,
  testers.isNotEqual
);

const getIsIngressIpsChanged = createSelector(
  getPreviousIngressIps,
  getIngressIps,
  testers.isNotEqual
);

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

export const getIsIngressIpsReadPending = createPendingSelector('hubIngressIps.read');
export const getIsIngressUrlsReadPending = createPendingSelector('hubIngressUrls.read');
const getIsIngressUrlCreatePending = createPendingSelector('hubIngressUrls.create');
const getIsIngressUrlEditPending = createPendingSelector('hubIngressUrl.update');
const getIsIngressIpCreatePending = createPendingSelector('hubIngressIps.create');
const getIsIngressIpEditPending = createPendingSelector('hubIngressIp.update');
const getIsIngressIpDeletePending = createPendingSelector('hubIngressIp.delete');

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

export const getIpsOperations = createSelector(
  getIngressIps,
  getPreviousIngressIps,
  (ips, previousIps) => ({
    create: ips.filter(ip => ip.state === STATES.UNSET),
    update: ips.filter(ip => ip.state !== STATES.UNSET).filter(ip => !isEqual(find(previousIps, { id: ip.id }), ip)),
    delete: previousIps.filter(ip => !find(ips, { id: ip.id })),
  })
);

export const getUrlsOperations = createSelector(
  getIngressUrls,
  getPreviousIngressUrls,
  (urls, previousUrls) => ({
    create: urls.filter(url => url.state === STATES.UNSET),
    update: urls
      .filter(url => url.state !== STATES.UNSET)
      .filter(url => !isEqual(find(previousUrls, { id: url.id }), url)),
    delete: previousUrls.filter(url => !find(urls, { id: url.id })),
  })
);
