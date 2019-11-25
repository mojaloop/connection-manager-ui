import { buildFetchActions } from '@modusbox/modusbox-ui-components/dist/redux-fetch';

const handleError = (error, status, state) => {
  if (status === 401) {
    window.location.assign(state.app.config.loginUrl);
    // should exit the execution of the function
    // otherwise the non-authenticated response will be
    // treater as a regular response error, causing the UI
    // to display wrong error messages
    return;
  }
  return { error, status };
};

const services = {
  connectionManager: {
    getApplicationUrl: state => state.app.config.apiUrl,
    getApplicationHeaders: () => {
      return undefined;
    },
    credentials: state => {
      if (state.auth.login.isDisabled) {
        return undefined;
      }
      return 'include';
    },
    sendAsJson: true,
    parseAsJson: true,
    handleError: handleError,
  },
  mockConnectionManager: {
    getApplicationUrl: () => 'http://localhost:8088',
    sendAsJson: true,
    parseAsJson: true,
  },
};

const endpoints = {
  login: {
    service: services.connectionManager,
    sendAsFormUrlEncoded: true,
    // the following key overrides the error handling for the login process.
    // The status code 401 unauthenticated needs to be handled differently on this endpoint
    handleError: () => null,
    url: '/login',
  },
  login2step: {
    service: services.connectionManager,
    sendAsFormUrlEncoded: true,
    // the following key overrides the error handling for the login process.
    // The status code 401 unauthenticated needs to be handled differently on this endpoint
    handleError: () => null,
    url: '/login2step',
  },
  logout: {
    service: services.connectionManager,
    url: '/logout',
  },
  environments: {
    service: services.connectionManager,
    url: '/environments',
  },
  dfsps: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/dfsps`,
  },
  dfsp: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}`,
  },
  monetaryZones: {
    service: services.connectionManager,
    url: () => `/monetaryzones`,
  },
  egressIps: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/endpoints/egress/ips`,
  },
  egressIp: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, ipId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/endpoints/egress/ips/${ipId}`,
  },
  ingressIps: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/endpoints/ingress/ips`,
  },
  ingressIp: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, ipId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/endpoints/ingress/ips/${ipId}`,
  },
  ingressUrls: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/endpoints/ingress/urls`,
  },
  ingressUrl: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, urlId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/endpoints/ingress/urls/${urlId}`,
  },
  hubEgressIps: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/endpoints/egress/ips`,
  },
  hubEgressIp: {
    service: services.connectionManager,
    url: ({ environmentId, ipId }) => `/environments/${environmentId}/hub/endpoints/egress/ips/${ipId}`,
  },
  hubIngressIps: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/endpoints/ingress/ips`,
  },
  hubIngressIp: {
    service: services.connectionManager,
    url: ({ environmentId, ipId }) => `/environments/${environmentId}/hub/endpoints/ingress/ips/${ipId}`,
  },
  hubIngressUrls: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/endpoints/ingress/urls`,
  },
  hubIngressUrl: {
    service: services.connectionManager,
    url: ({ environmentId, urlId }) => `/environments/${environmentId}/hub/endpoints/ingress/urls/${urlId}`,
  },
  unprocessedEndpoints: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/dfsps/endpoints/unprocessed`,
  },
  confirmEndpoint: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, endpointId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/endpoints/${endpointId}/confirmation`,
  },
  hubEndpoints: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/endpoints`,
  },
  dfspCa: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/ca`,
  },
  hubCas: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/cas`,
  },
  hubCa: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/ca/rootCert`,
  },
  hubExternalCas: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/cas`,
  },
  inboundEnrollments: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/enrollments/inbound`,
  },
  inboundEnrollmentSign: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, enrollmentId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/enrollments/inbound/${enrollmentId}/sign`,
  },
  inboundEnrollmentCertificate: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, enrollmentId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/enrollments/inbound/${enrollmentId}/certificate`,
  },
  outboundEnrollments: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/enrollments/outbound`,
  },
  outboundEnrollmentCsr: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/enrollments/outbound/csr`,
  },
  outboundEnrollmentCertificate: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, enrollmentId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/enrollments/outbound/${enrollmentId}/certificate`,
  },
  outboundEnrollmentValidate: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId, enrollmentId }) =>
      `/environments/${environmentId}/dfsps/${dfspId}/enrollments/outbound/${enrollmentId}/validate`,
  },
  hubServerCerts: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/hub/servercerts`,
  },
  dfspsServerCerts: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/servercerts`,
  },
  dfspServerCerts: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/servercerts`,
  },
  dfspsJWSCerts: {
    service: services.connectionManager,
    url: ({ environmentId }) => `/environments/${environmentId}/dfsps/jwscerts`,
  },
  dfspJWSCerts: {
    service: services.connectionManager,
    url: ({ environmentId, dfspId }) => `/environments/${environmentId}/dfsps/${dfspId}/jwscerts`,
  },
};

const apis = buildFetchActions(endpoints);
export default apis;
