import { createSelector } from 'reselect';
import * as testers from 'utils/testers';
import { createPendingSelector } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';

export const getDfspCsrCertificate = state => state.dfsp.tls.client.csr.dfspCsrCertificate;
export const getIsDfspCsrModalVisible = state => state.dfsp.tls.client.csr.isDfspCsrModalVisible;

export const getIsDfspCsrSubmitPending = createPendingSelector('inboundEnrollments.create');

export const getIsDfspCsrSubmitEnabled = createSelector(getDfspCsrCertificate, testers.isNotNil);
