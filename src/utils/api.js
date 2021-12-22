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
  dfsps: {
    service: services.connectionManager,
    url: () => `/dfsps`,
  },
  dfsp: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}`,
  },
  monetaryZones: {
    service: services.connectionManager,
    url: () => `/monetaryzones`,
  },
  egressIps: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/endpoints/egress/ips`,
  },
  egressIp: {
    service: services.connectionManager,
    url: ({ dfspId, ipId }) =>
      `/dfsps/${dfspId}/endpoints/egress/ips/${ipId}`,
  },
  ingressIps: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/endpoints/ingress/ips`,
  },
  ingressIp: {
    service: services.connectionManager,
    url: ({ dfspId, ipId }) =>
      `/dfsps/${dfspId}/endpoints/ingress/ips/${ipId}`,
  },
  ingressUrls: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/endpoints/ingress/urls`,
  },
  ingressUrl: {
    service: services.connectionManager,
    url: ({ dfspId, urlId }) =>
      `/dfsps/${dfspId}/endpoints/ingress/urls/${urlId}`,
  },
  hubEgressIps: {
    service: services.connectionManager,
    url: () => `/hub/endpoints/egress/ips`,
  },
  hubEgressIp: {
    service: services.connectionManager,
    url: ({ ipId }) => `/hub/endpoints/egress/ips/${ipId}`,
  },
  hubIngressIps: {
    service: services.connectionManager,
    url: () => `/hub/endpoints/ingress/ips`,
  },
  hubIngressIp: {
    service: services.connectionManager,
    url: ({ ipId }) => `/hub/endpoints/ingress/ips/${ipId}`,
  },
  hubIngressUrls: {
    service: services.connectionManager,
    url: () => `/hub/endpoints/ingress/urls`,
  },
  hubIngressUrl: {
    service: services.connectionManager,
    url: ({ urlId }) => `/hub/endpoints/ingress/urls/${urlId}`,
  },
  unprocessedEndpoints: {
    service: services.connectionManager,
    url: () => `/dfsps/endpoints/unprocessed`,
  },
  confirmEndpoint: {
    service: services.connectionManager,
    url: ({ dfspId, endpointId }) =>
      `/dfsps/${dfspId}/endpoints/${endpointId}/confirmation`,
  },
  hubEndpoints: {
    service: services.connectionManager,
    url: () => `/hub/endpoints`,
  },
  dfspCa: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/ca`,
  },
  hubCa: {
    service: services.connectionManager,
    url: () => `/hub/ca`,
  },
  inboundEnrollments: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/enrollments/inbound`,
  },
  inboundEnrollmentSign: {
    service: services.connectionManager,
    url: ({ dfspId, enrollmentId }) =>
      `/dfsps/${dfspId}/enrollments/inbound/${enrollmentId}/sign`,
  },
  inboundEnrollmentCertificate: {
    service: services.connectionManager,
    url: ({ dfspId, enrollmentId }) =>
      `/dfsps/${dfspId}/enrollments/inbound/${enrollmentId}/certificate`,
  },
  outboundEnrollments: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/enrollments/outbound`,
  },
  outboundEnrollmentCsr: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/enrollments/outbound/csr`,
  },
  outboundEnrollmentCertificate: {
    service: services.connectionManager,
    url: ({ dfspId, enrollmentId }) =>
      `/dfsps/${dfspId}/enrollments/outbound/${enrollmentId}/certificate`,
  },
  outboundEnrollmentValidate: {
    service: services.connectionManager,
    url: ({ dfspId, enrollmentId }) =>
      `/dfsps/${dfspId}/enrollments/outbound/${enrollmentId}/validate`,
  },
  hubServerCerts: {
    service: services.connectionManager,
    url: () => `/hub/servercerts`,
  },
  dfspsServerCerts: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/servercerts`,
  },
  dfspServerCerts: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/servercerts`,
  },
  dfspsJWSCerts: {
    service: services.connectionManager,
    url: () => `/dfsps/jwscerts`,
  },
  dfspJWSCerts: {
    service: services.connectionManager,
    url: ({ dfspId }) => `/dfsps/${dfspId}/jwscerts`,
  },
};

const apis = buildFetchActions(endpoints);
export default apis;
