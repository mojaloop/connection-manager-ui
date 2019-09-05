import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels, ScrollBox } from 'components';
import Egress from './Egress';
import Ingress from './Ingress';

const Endpoints = () => (
  <ScrollBox>
    <Tabs>
      <TabList>
        <Tab>Egress Endpoints</Tab>
        <Tab>Ingress Endpoints</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Egress />
        </TabPanel>
        <TabPanel>
          <Ingress />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </ScrollBox>
);
export default Endpoints;
