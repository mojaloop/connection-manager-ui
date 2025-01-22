import React from 'react';
import { connect } from 'react-redux';
import { Icon, Row, Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import HUBCertificateAuthority from './HUBCertificateAuthority';
import HUBExternalCertificateAuthority from './HUBExternalCertificateAuthority';
import DFSPCertificateAuthority from './DFSPCertificateAuthority';

import { getIsHubCaMissing } from 'App/Hub/CertificateAuthorities/HUBCertificateAuthority/selectors';
import { getIsHubExternalCasMissing } from 'App/Hub/CertificateAuthorities/HUBExternalCertificateAuthority/selectors';

const stateProps = state => ({
  isHubCaMissing: getIsHubCaMissing(state),
  isHubExternalCasMissing: getIsHubExternalCasMissing(state),
});

const CertificateAuthorities = ({ isHubCaMissing, isHubExternalCasMissing }) => (
  <div>
    <Tabs>
      <TabList>
        <Tab>
          <Row align="center">
            {isHubCaMissing && <Icon size={8} name="circle" className="hub-tls__notification-icon" />}
            HUB Certificate Authority
          </Row>
        </Tab>
        <Tab>
          <Row align="center">
            {isHubExternalCasMissing && <Icon size={8} name="circle" className="hub-tls__notification-icon" />}
            HUB External Certificate Authority
          </Row>
        </Tab>
        <Tab>DFSP Certificate Authority</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <HUBCertificateAuthority />
        </TabPanel>
        <TabPanel>
          <HUBExternalCertificateAuthority />
        </TabPanel>
        <TabPanel>
          <DFSPCertificateAuthority />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default connect(stateProps, null)(CertificateAuthorities);
