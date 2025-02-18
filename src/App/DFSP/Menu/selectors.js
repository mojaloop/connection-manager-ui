import { createSelector } from 'reselect';
import { getDfspHasUnsignedHubCsrs } from 'App/DFSP/TLSClientCertificates/HubCSRs/selectors';

const setIcon = test => ({
  icon: test ? 'circle' : undefined,
  fill: test ? '#f96' : undefined,
});

export const getMenuIcons = createSelector(getDfspHasUnsignedHubCsrs, hasUnsignedCsrs => ({
  csrs: setIcon(hasUnsignedCsrs),
}));
