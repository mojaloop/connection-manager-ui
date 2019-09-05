import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import DFSPJWS from './DFSPJWS';
import DFSPsJWS from './DFSPsJWS';

const TLSServerCertificates = () => (
  <div>
    <Tabs>
      <TabList>
        <Tab>DFSP JWS Certificates</Tab>
        <Tab>Other DFSPs JWS Certificates</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DFSPJWS />
        </TabPanel>
        <TabPanel>
          <DFSPsJWS />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default TLSServerCertificates;
