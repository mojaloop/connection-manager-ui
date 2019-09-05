import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { getDfspId } from 'App/selectors';
import { resetDfspEgress, storeDfspEgressIps } from './Endpoints/Egress/actions';
import { resetDfspIngress, storeDfspEndpoints } from './Endpoints/Ingress/actions';
import { resetDfspCa, storeDfspCa } from './CertificateAuthorities/DFSPCertificateAuthority/actions';
import { resetDfspHubCa, storeDfspHubCa } from './CertificateAuthorities/HUBCertificateAuthority/actions';
import {
  resetDfspHubExternalCa,
  storeDfspHubExternalCas,
} from './CertificateAuthorities/HUBExternalCertificateAuthority/actions';
import { resetDfspSentCsrs, storeDfspSentCsrs } from './TLSClientCertificates/SentCSRs/actions';
import { resetDfspHubCsrs, storeDfspHubCsrs } from './TLSClientCertificates/HubCSRs/actions';
import { resetDfspSC, storeDfspSCServerCertificate } from './TLSServerCertificates/DFSPSC/actions';
import { resetDfspHubSC, storeDfspHubSCServerCertificate } from './TLSServerCertificates/HubSC/actions';
import { resetDfspJWS, storeDfspJWSCertificates } from './JWSCertificates/DFSPJWS/actions';
import { resetDfspsJWS, storeDfspsJWSCertificates } from './JWSCertificates/DFSPsJWS/actions';

export const SET_DFSP_LOADING = 'DFSP / Set Is Loading';
export const UNSET_DFSP_LOADING = 'DFSP / Unset Is Loading';

export const setDfspLoading = createAction(SET_DFSP_LOADING);
export const unsetDfspLoading = createAction(UNSET_DFSP_LOADING);

export const initDfsp = () => async (dispatch, getState) => {
  dispatch(setDfspLoading());

  if (!getDfspId(getState())) {
    // redirect to root when no DFSP Id is set
    dispatch(push('/'));
  } else {
    dispatch(resetDfspEgress());
    dispatch(resetDfspIngress());
    dispatch(resetDfspCa());
    dispatch(resetDfspHubCa());
    dispatch(resetDfspHubExternalCa());
    dispatch(resetDfspSentCsrs());
    dispatch(resetDfspHubCsrs());
    dispatch(resetDfspSC());
    dispatch(resetDfspHubSC());
    dispatch(resetDfspsJWS());
    dispatch(resetDfspJWS());

    await Promise.all([
      dispatch(storeDfspEgressIps()),
      dispatch(storeDfspEndpoints()),
      dispatch(storeDfspCa()),
      dispatch(storeDfspSCServerCertificate()),
    ]);
    dispatch(storeDfspHubCa());
    dispatch(storeDfspHubExternalCas());
    dispatch(storeDfspSentCsrs());
    dispatch(storeDfspHubCsrs());
    dispatch(storeDfspHubSCServerCertificate());
    dispatch(storeDfspJWSCertificates());
    dispatch(storeDfspsJWSCertificates());
  }

  dispatch(unsetDfspLoading());
};
