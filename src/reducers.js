import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducers as api } from 'modusbox-ui-components/dist/redux-fetch';

import auth from 'Auth/reducers';
import totp from 'Auth/TOTP/reducers';
import passwordChange from 'Auth/PasswordChange/reducers';
import app from 'App/reducers';

import hubEgress from 'App/Hub/Endpoints/Egress/reducers';
import hubIngress from 'App/Hub/Endpoints/Ingress/reducers';
import hub from 'App/Hub/reducers';
import unprocessed from 'App/Hub/UnprocessedEndpoints/reducers';
import hubCa from 'App/Hub/CertificateAuthorities/HUBCertificateAuthority/reducers';
import hubExternalCa from 'App/Hub/CertificateAuthorities/HUBExternalCertificateAuthority/reducers';
import hubDfspCa from 'App/Hub/CertificateAuthorities/DFSPCertificateAuthority/reducers';
import hubCsr from 'App/Hub/TLSClientCertificates/CSR/reducers';
import hubSentCsrs from 'App/Hub/TLSClientCertificates/SentCSRs/reducers';
import hubDfspCsrs from 'App/Hub/TLSClientCertificates/DFSPCSRs/reducers';
import hubSC from 'App/Hub/TLSServerCertificates/HubSC/reducers';
import hubDfspSc from 'App/Hub/TLSServerCertificates/DFSPSC/reducers';
import hubDfspModal from 'App/Hub/DFSPs/DFSPModal/reducers';

import dfspEgress from 'App/DFSP/Endpoints/Egress/reducers';
import dfspIngress from 'App/DFSP/Endpoints/Ingress/reducers';
import dfspHubEndpoints from 'App/DFSP/HubEndpoints/reducers';
import dfsp from 'App/DFSP/reducers';
import dfspCa from 'App/DFSP/CertificateAuthorities/DFSPCertificateAuthority/reducers';
import dfspHubCa from 'App/DFSP/CertificateAuthorities/HUBCertificateAuthority/reducers';
import dfspHubExternalCa from 'App/DFSP/CertificateAuthorities/HUBExternalCertificateAuthority/reducers';
import dfspCsr from 'App/DFSP/TLSClientCertificates/CSR/reducers';
import dfspSentCsrs from 'App/DFSP/TLSClientCertificates/SentCSRs/reducers';
import dfspHubCsrs from 'App/DFSP/TLSClientCertificates/HubCSRs/reducers';
import dfspSC from 'App/DFSP/TLSServerCertificates/DFSPSC/reducers';
import dfspHubSC from 'App/DFSP/TLSServerCertificates/HubSC/reducers';
import dfspJWS from 'App/DFSP/JWSCertificates/DFSPJWS/reducers';
import dfspsJWS from 'App/DFSP/JWSCertificates/DFSPsJWS/reducers';

const reducers = (history, isAuthEnabled) =>
  combineReducers({
    router: connectRouter(history),
    api,
    auth: combineReducers({
      login: auth(isAuthEnabled),
      totp,
      password: passwordChange,
    }),
    app,
    dfsp: combineReducers({
      dfsp,
      endpoints: combineReducers({
        dfsp: combineReducers({
          egress: dfspEgress,
          ingress: dfspIngress,
        }),
        hub: dfspHubEndpoints,
      }),
      ca: combineReducers({
        dfsp: dfspCa,
        hub: dfspHubCa,
        hubExternal: dfspHubExternalCa,
      }),
      tls: combineReducers({
        client: combineReducers({
          csr: dfspCsr,
          csrs: dfspSentCsrs,
          hub: dfspHubCsrs,
        }),
        server: combineReducers({
          dfsp: dfspSC,
          hub: dfspHubSC,
        }),
      }),
      jws: combineReducers({
        dfsp: dfspJWS,
        dfsps: dfspsJWS,
      }),
    }),
    hub: combineReducers({
      hub,
      unprocessed,
      endpoints: combineReducers({
        egress: hubEgress,
        ingress: hubIngress,
      }),
      ca: combineReducers({
        dfsps: hubDfspCa,
        hub: hubCa,
        external: hubExternalCa,
      }),
      tls: combineReducers({
        client: combineReducers({
          csr: hubCsr,
          csrs: hubSentCsrs,
          dfsps: hubDfspCsrs,
        }),
        server: combineReducers({
          hub: hubSC,
          dfsps: hubDfspSc,
        }),
      }),
      dfspModal: hubDfspModal,
    }),
  });

export default reducers;
