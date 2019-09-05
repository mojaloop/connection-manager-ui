import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import HubSC from './HubSC';
import DFSPSC from './DFSPSC';

const TLSServerCertificates = () => (
  <div>
    <Tabs>
      <TabList>
        <Tab>Hub Server Certificates</Tab>
        <Tab>DFSPs Server Certificates</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <HubSC />
        </TabPanel>
        <TabPanel>
          <DFSPSC />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default TLSServerCertificates;
