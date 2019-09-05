import { createSelector } from 'reselect';
import { getHubHasUnprocessedEndpoints } from 'App/Hub/UnprocessedEndpoints/selectors';
import { getIsHubCaMissing } from 'App/Hub/CertificateAuthorities/HUBCertificateAuthority/selectors';
import { getIsHubExternalCasMissing } from 'App/Hub/CertificateAuthorities/HUBExternalCertificateAuthority/selectors';
import { getHubHasUnsignedDfspCsrs } from 'App/Hub/TLSClientCertificates/DFSPCSRs/selectors';
import { getHubHasUnvalidatedDfspCsrs } from 'App/Hub/TLSClientCertificates/SentCSRs/selectors';

const setIcon = test => ({
  icon: test ? 'circle' : undefined,
  fill: test ? '#f96' : undefined,
});

export const getMenuIcons = createSelector(
  getHubHasUnprocessedEndpoints,
  getHubHasUnsignedDfspCsrs,
  getHubHasUnvalidatedDfspCsrs,
  getIsHubCaMissing,
  getIsHubExternalCasMissing,
  (hasUnprocessedEndpoints, hasUnsignedCsrs, hasUnvalidatedCsrs, isCaMissing, isExternalCasMissing) => ({
    unprocessed: setIcon(hasUnprocessedEndpoints),
    csrs: setIcon(hasUnsignedCsrs || hasUnvalidatedCsrs),
    ca: setIcon(isCaMissing || isExternalCasMissing),
  })
);
