import { createSelector } from 'reselect';
import find from 'lodash/find';
import * as testers from 'utils/testers';
import { getIsValid, toValidationResult } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import { getDfsps } from 'App/selectors';
import { getMonetaryZones } from 'App/MonetaryZones/selectors';
import { getHubDfspModalValidators } from './validators';

const buildDfspModel = (name, dfspId, monetaryZoneId, email) => {
  const model = { name, dfspId, monetaryZoneId };
  if (email?.trim()) {
    model.email = email;
  }
  return model;
};

export const getHubDfspModalName = state => state.hub.dfspModal.hubDfspName;
export const getHubDfspModalDefaultId = state => state.hub.dfspModal.hubDfspDefaultId;
export const getHubDfspModalMonetaryZoneId = state => state.hub.dfspModal.hubDfspMonetaryZoneId;
export const getHubDfspModalEmail = state => state.hub.dfspModal.hubDfspEmail;
export const getIsHubDfspModalOverrideIdSet = state => state.hub.dfspModal.isHubDfspOverrideIdSet;
export const getHubDfspModalOverrideId = state => state.hub.dfspModal.hubDfspOverrideId;
export const getIsHubDfspModalVisible = state => state.hub.dfspModal.isHubDfspModalVisible;
export const getPreviousHubDfspModalName = state => state.hub.dfspModal.previousHubDfspName;
export const getPreviousHubDfspModalId = state => state.hub.dfspModal.previousHubDfspId;
export const getPreviousHubDfspModalMonetaryZoneId = state => state.hub.dfspModal.previousHubDfspMonetaryZoneId;
export const getPreviousHubDfspModalEmail = state => state.hub.dfspModal.previousHubDfspEmail;

export const getIsExistingDfsp = createSelector(getPreviousHubDfspModalId, id => id !== undefined);

export const getMonetaryZoneOptions = createSelector(getMonetaryZones, zones =>
  zones.map(zone => ({
    label: zone.name,
    value: zone.monetaryZoneId,
  }))
);

export const getHubDfspModalId = createSelector(
  getHubDfspModalDefaultId,
  getHubDfspModalOverrideId,
  getIsHubDfspModalOverrideIdSet,
  (defaultId, overrideId, isOverrideSet) => (isOverrideSet ? overrideId : defaultId)
);

const getHubDfspModalIsNameUnique = createSelector(
  getDfsps,
  getHubDfspModalName,
  getPreviousHubDfspModalName,
  (dfsps, name, previousName) => !find(dfsps, dfsp => dfsp.name === name && previousName !== dfsp.name)
);

const getHubDfspModalIsIdUnique = createSelector(
  getDfsps,
  getHubDfspModalId,
  getPreviousHubDfspModalId,
  (dfsps, id, previousId) => !find(dfsps, dfsp => dfsp.id === id && previousId !== dfsp.id)
);

const getHubDfspModalValidation = createSelector(
  getHubDfspModalName,
  getHubDfspModalIsNameUnique,
  getHubDfspModalId,
  getHubDfspModalIsIdUnique,
  getHubDfspModalEmail,
  getHubDfspModalValidators
);

export const getHubDfspModalModel = createSelector(
  getHubDfspModalName,
  getHubDfspModalId,
  getHubDfspModalMonetaryZoneId,
  getHubDfspModalEmail,
  buildDfspModel
);

export const getPreviousHubDfspModalModel = createSelector(
  getPreviousHubDfspModalName,
  getPreviousHubDfspModalId,
  getPreviousHubDfspModalMonetaryZoneId,
  getPreviousHubDfspModalEmail,
  buildDfspModel
);

export const getHubDfspModalValidationResult = createSelector(
  getHubDfspModalModel,
  getHubDfspModalValidation,
  toValidationResult
);

const isModelValid = createSelector(getHubDfspModalValidationResult, getIsValid);

const isModelChanged = createSelector(getPreviousHubDfspModalModel, getHubDfspModalModel, testers.isNotEqual);

export const getIsHubDfspModalSubmitEnabled = createSelector(isModelValid, isModelChanged, testers.getAllAre(true));

export const getIsHubDfspCreatePending = createPendingSelector('dfsps.create');
export const getIsHubDfspUpdatePending = createPendingSelector('dfsp.update');
export const getIsHubDfspModalSubmitPending = createSelector(
  getIsHubDfspCreatePending,
  getIsHubDfspUpdatePending,
  testers.getAnyIs(true)
);
