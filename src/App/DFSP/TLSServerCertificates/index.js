import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import DFSPSC from './DFSPSC';
import HubSC from './HubSC';

const TLSServerCertificates = () => (
  <div>
    <Tabs>
      <TabList>
        <Tab>DFSP Server Certificates</Tab>
        <Tab>Hub Server Certificates</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DFSPSC />
        </TabPanel>
        <TabPanel>
          <HubSC />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default TLSServerCertificates;
