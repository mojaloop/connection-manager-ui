import React from 'react';
import { connect } from 'react-redux';
import { Icon, Row, Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import CSR from './CSR';
import SentCSRs from './SentCSRs';
import HubCSRs from './HubCSRs';
import './index.css';

import { getDfspHasUnsignedHubCsrs } from 'App/DFSP/TLSClientCertificates/HubCSRs/selectors';

const stateProps = state => ({
  hasUnsignedCsrs: getDfspHasUnsignedHubCsrs(state),
});

const TLSClientCertificates = ({ hasUnsignedCsrs, hasUnvalidatedCsrs }) => (
  <div>
    <Tabs>
      <TabList>
        <Tab>CSR</Tab>
        <Tab>Sent CSRs</Tab>
        <Tab>
          <Row align="center">
            {hasUnsignedCsrs && <Icon size={8} name="circle" className="dfsp-tls__notification-icon" />}
            Unprocessed Hub CSRs
          </Row>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CSR />
        </TabPanel>
        <TabPanel>
          <SentCSRs />
        </TabPanel>
        <TabPanel>
          <HubCSRs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default connect(
  stateProps,
  null
)(TLSClientCertificates);
