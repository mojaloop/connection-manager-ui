import React from 'react';
import { Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import RotateHubJwsCerts from './Rotate';

const HubJwsCerts = () => (
  <div>
    <Tabs>
      <TabList>
        <Tab>Hub JWS Certs</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <RotateHubJwsCerts />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);
export default HubJwsCerts;
