import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { validate, getIsValid } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import * as testers from 'utils/testers';
import { STATES } from '../constants';
import { getEgressAddressValidation, getEgressPortValidation } from './validators';

export const getPreviousEgressIps = state => state.hub.endpoints.egress.previousEgressIps;
export const getEgressError = state => state.hub.endpoints.egress.egressError;
export const getEgressIps = state => state.hub.endpoints.egress.egressIps;

export const getEgressIpsValidationResult = createSelector(
  getEgressIps,
  getEgressAddressValidation,
  getEgressPortValidation,
  (configurations, addressValidation, portValidation) =>
    configurations.map(({ address, ports }) => ({
      address: validate(address, addressValidation),
      ports: ports.map(port => validate(port, portValidation)),
    }))
);

export const getIsEgressChanged = createSelector(
  getPreviousEgressIps,
  getEgressIps,
  testers.isNotEqual
);

export const getIsEgressIpsValid = createSelector(
  getEgressIpsValidationResult,
  results => results.every(result => getIsValid(result.address) && result.ports.every(getIsValid))
);

export const getIsEgressIpsSubmitEnabled = createSelector(
  getIsEgressIpsValid,
  getIsEgressChanged,
  testers.getAllAre(true)
);

const getIsEgressIpsReadPending = createPendingSelector('hubEgressIps.read');
const getIsEgressIpCreatePending = createPendingSelector('hubEgressIps.create');
const getIsEgressIpEditPending = createPendingSelector('hubEgressIp.update');
const getIsEgressIpDeletePending = createPendingSelector('hubEgressIp.delete');

export const getIsEgressPending = getIsEgressIpsReadPending;
export const getIsEgressSubmitPending = createSelector(
  getIsEgressIpCreatePending,
  getIsEgressIpEditPending,
  getIsEgressIpDeletePending,
  testers.getAnyIs(true)
);

export const getIpsOperations = createSelector(
  getEgressIps,
  getPreviousEgressIps,
  (ips, previousIps) => ({
    create: ips.filter(ip => ip.state === STATES.UNSET),
    update: ips.filter(ip => ip.state !== STATES.UNSET).filter(ip => !isEqual(find(previousIps, { id: ip.id }), ip)),
    delete: previousIps.filter(ip => !find(ips, { id: ip.id })),
  })
);
