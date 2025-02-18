import React from 'react';
import { connect } from 'react-redux';
import { Icon, Row, Tab, Tabs, TabList, TabPanel, TabPanels } from 'components';
import CSR from './CSR';
import SentCSRs from './SentCSRs';
import DFSPCSRs from './DFSPCSRs';
import './index.css';

import { getHubHasUnsignedDfspCsrs } from './DFSPCSRs/selectors';
import { getHubHasUnvalidatedDfspCsrs } from './SentCSRs/selectors';

const stateProps = state => ({
  hasUnsignedCsrs: getHubHasUnsignedDfspCsrs(state),
  hasUnvalidatedCsrs: getHubHasUnvalidatedDfspCsrs(state),
});

const TLSClientCertificates = ({ hasUnsignedCsrs, hasUnvalidatedCsrs }) => (
  <div>
    <Tabs>
      <TabList>
        <Tab>CSR</Tab>
        <Tab>
          <Row align="center">
            {hasUnvalidatedCsrs && <Icon size={8} name="circle" className="hub-tls__notification-icon" />}
            Sent CSRs
          </Row>
        </Tab>
        <Tab>
          <Row align="center">
            {hasUnsignedCsrs && <Icon size={8} name="circle" className="hub-tls__notification-icon" />}
            Unprocessed DFSP CSRs
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
          <DFSPCSRs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export default connect(stateProps, null)(TLSClientCertificates);
