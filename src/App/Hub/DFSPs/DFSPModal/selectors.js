import { createSelector } from 'reselect';
import find from 'lodash/find';
import { getIsValid, toValidationResult } from 'modusbox-ui-components/dist/redux-validation';
import { getHubDfspModalValidators } from './validators';
import { getDfsps } from 'App/selectors';
import { createPendingSelector } from 'modusbox-ui-components/dist/redux-fetch';

export const getHubDfspModalName = state => state.hub.dfspModal.hubDfspName;
export const getHubDfspModalDefaultId = state => state.hub.dfspModal.hubDfspDefaultId;
export const getIsHubDfspModalOverrideIdSet = state => state.hub.dfspModal.isHubDfspOverrideIdSet;
export const getHubDfspModalOverrideId = state => state.hub.dfspModal.hubDfspOverrideId;
export const getIsHubDfspModalVisible = state => state.hub.dfspModal.isHubDfspModalVisible;

export const getHubDfspModalId = createSelector(
  getHubDfspModalDefaultId,
  getHubDfspModalOverrideId,
  getIsHubDfspModalOverrideIdSet,
  (defaultId, overrideId, isOverrideSet) => (isOverrideSet ? overrideId : defaultId)
);

const getHubDfspModalIsNameUnique = createSelector(
  getDfsps,
  getHubDfspModalName,
  (dfsps, name) => !find(dfsps, { name })
);

const getHubDfspModalIsIdUnique = createSelector(
  getDfsps,
  getHubDfspModalId,
  (dfsps, id) => !find(dfsps, { id })
);

const getHubDfspModalValidation = createSelector(
  getHubDfspModalName,
  getHubDfspModalIsNameUnique,
  getHubDfspModalId,
  getHubDfspModalIsIdUnique,
  getHubDfspModalValidators
);

export const getHubDfspModalModel = createSelector(
  getHubDfspModalName,
  getHubDfspModalId,
  (name, dfspId) => ({ name, dfspId })
);

export const getHubDfspModalValidationResult = createSelector(
  getHubDfspModalModel,
  getHubDfspModalValidation,
  toValidationResult
);

const isModelValid = createSelector(
  getHubDfspModalValidationResult,
  getIsValid
);

export const getIsHubDfspModalSubmitEnabled = createSelector(
  isModelValid,
  isValid => isValid === true
);

export const getIsHubDfspCreatePending = createPendingSelector('dfsps.create');
