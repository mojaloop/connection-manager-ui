import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { storeMonetaryZones } from 'App/MonetaryZones/actions';
import { resetHubEgress, storeHubEgressIps } from './Endpoints/Egress/actions';
import { resetHubIngress, storeHubEndpoints } from './Endpoints/Ingress/actions';
import { resetHubUnprocessed, storeUnprocessedEndpoints } from './UnprocessedEndpoints/actions';
import { resetHubCa, storeHubCa } from './CertificateAuthorities/HUBCertificateAuthority/actions';
import {
  resetHubExternalCa,
  storeHubExternalCa,
} from './CertificateAuthorities/HUBExternalCertificateAuthority/actions';
import { resetHubDfspCas, storeHubDfspCas } from './CertificateAuthorities/DFSPCertificateAuthority/actions';
import { resetHubSentCsrs, storeHubSentCsrs } from './TLSClientCertificates/SentCSRs/actions';
import { resetHubDfspCsrs, storeHubDfspCsrs } from './TLSClientCertificates/DFSPCSRs/actions';
import { resetHubSC, storeHubSCServerCertificate } from './TLSServerCertificates/HubSC/actions';
import { resetHubDfspSCs, storeHubDfspSCServerCertificates } from './TLSServerCertificates/DFSPSC/actions';

export const SET_HUB_LOADING = 'HUB / Set Is Loading';
export const UNSET_HUB_LOADING = 'HUB / Unset Is Loading';

export const setHubLoading = createAction(SET_HUB_LOADING);
export const unsetHubLoading = createAction(UNSET_HUB_LOADING);

export const initHub = () => async (dispatch, getState) => {
  dispatch(setHubLoading());

  dispatch(resetHubEgress());
  dispatch(resetHubIngress());
  dispatch(resetHubUnprocessed());
  dispatch(resetHubCa());
  dispatch(resetHubExternalCa());
  dispatch(resetHubDfspCas());
  dispatch(resetHubSentCsrs());
  dispatch(resetHubDfspCsrs());
  dispatch(resetHubSC());
  dispatch(resetHubDfspSCs());

  // Need Hub data to be setup before allowing the user to see the app
  await Promise.all([dispatch(storeHubCa()), dispatch(storeHubSentCsrs()), dispatch(storeHubSCServerCertificate())]);

  // DFSP data can be loaded asynchronously
  dispatch(storeHubEgressIps());
  dispatch(storeHubEndpoints());
  dispatch(storeUnprocessedEndpoints());
  dispatch(storeHubExternalCa());
  dispatch(storeHubDfspCas());
  dispatch(storeHubDfspCsrs());
  dispatch(storeHubDfspSCServerCertificates());
  dispatch(storeMonetaryZones());

  dispatch(unsetHubLoading());
};
