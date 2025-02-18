import { createSelector } from 'reselect';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import * as testers from 'utils/testers';

export const getDfspJWSError = state => state.dfsp.jws.dfsp.dfspJWSError;
export const getPreviousDfspJWSJwsCertificate = state => state.dfsp.jws.dfsp.previousDfspJWSJwsCertificate;
export const getPreviousDfspJWSIntermediateChain = state => state.dfsp.jws.dfsp.previousDfspJWSIntermediateChain;
export const getDfspJWSJwsCertificate = state => state.dfsp.jws.dfsp.dfspJWSJwsCertificate;
export const getDfspJWSIntermediateChain = state => state.dfsp.jws.dfsp.dfspJWSIntermediateChain;
export const getDfspJWSJwsCertificateInfo = state => state.dfsp.jws.dfsp.dfspJWSJwsCertificateInfo;
export const getDfspJWSIntermediateChainInfo = state => state.dfsp.jws.dfsp.dfspJWSIntermediateChainInfo;
export const getDfspJWSValidations = state => state.dfsp.jws.dfsp.dfspJWSValidations;
export const getDfspJWSValidationState = state => state.dfsp.jws.dfsp.dfspJWSValidationState;
export const getIsDfspJWSJwsCertificateModalVisible = state => state.dfsp.jws.dfsp.isDfspJWSJwsCertificateModalVisible;
export const getIsDfspJWSIntermediateChainModalVisible = state =>
  state.dfsp.jws.dfsp.isDfspJWSIntermediateChainModalVisible;

const buildDfspJWSModel = (jwsCertificate, intermediateChain, serverCertificate) => ({
  jwsCertificate,
  intermediateChain,
});
const getPreviousDfspJWSModel = createSelector(
  getPreviousDfspJWSJwsCertificate,
  getPreviousDfspJWSIntermediateChain,
  buildDfspJWSModel
);
export const getDfspJWSModel = createSelector(getDfspJWSJwsCertificate, getDfspJWSIntermediateChain, buildDfspJWSModel);
const getIsDfspJWSModelChanged = createSelector(getPreviousDfspJWSModel, getDfspJWSModel, testers.isNotEqual);
const getIsDfspJWSJwsCertificateValid = createSelector(getDfspJWSJwsCertificate, testers.isNotNil);

export const getIsDfspJWSEditingExisitingModel = createSelector(getPreviousDfspJWSJwsCertificate, testers.isNotNil);
export const getIsDfspJWSSubmitEnabled = createSelector(
  getIsDfspJWSJwsCertificateValid,
  getIsDfspJWSModelChanged,
  testers.getAllAre(true)
);

export const getIsDfspJWSCreatePending = createPendingSelector('dfspJWSCerts.create');
export const getIsDfspJWSUpdatePending = createPendingSelector('dfspJWSCerts.update');
export const getIsDfspJWSSubmitPending = createSelector(
  getIsDfspJWSCreatePending,
  getIsDfspJWSUpdatePending,
  testers.getAnyIs(true)
);
