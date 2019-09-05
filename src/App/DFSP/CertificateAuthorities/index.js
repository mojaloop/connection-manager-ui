import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import DFSPCertificateAuthority from './DFSPCertificateAuthority';
import HUBCertificateAuthority from './HUBCertificateAuthority';
import HUBExternalCertificateAuthority from './HUBExternalCertificateAuthority';

const CertificateAuthorities = () => (
  <div>
    <Tabs>
      <TabList>
        <Tab>DFSP Certificate Authority</Tab>
        <Tab>HUB Certificate Authority</Tab>
        <Tab>HUB External Certificate Authority</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DFSPCertificateAuthority />
        </TabPanel>
        <TabPanel>
          <HUBCertificateAuthority />
        </TabPanel>
        <TabPanel>
          <HUBExternalCertificateAuthority />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default CertificateAuthorities;
