import { createSelector } from 'reselect';
import * as testers from 'utils/testers';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';

export const getDfspCsrCertificate = state => state.dfsp.tls.client.csr.dfspCsrCertificate;
export const getIsDfspCsrModalVisible = state => state.dfsp.tls.client.csr.isDfspCsrModalVisible;

export const getIsDfspCsrSubmitPending = createPendingSelector('inboundEnrollments.create');

export const getIsDfspCsrSubmitEnabled = createSelector(getDfspCsrCertificate, testers.isNotNil);
