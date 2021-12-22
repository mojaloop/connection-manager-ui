import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { Heading, ScrollBox, Spinner } from 'components';

import { getIsHubLoading } from './selectors';
import { initHub } from './actions';

import Menu from './Menu';
import UnprocessedEndpoints from './UnprocessedEndpoints';
import Endpoints from './Endpoints';
import CertificateAuthorities from './CertificateAuthorities';
import TLSClientCertificates from './TLSClientCertificates';
import TLSServerCertificates from './TLSServerCertificates';
import DFSPs from './DFSPs';
import './Hub.css';

const stateProps = state => ({
  isHubLoading: getIsHubLoading(state),
});

const actionProps = dispatch => ({
  initHub: () => dispatch(initHub()),
});

class HubWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.props.initHub();
  }
  componentDidUpdate(prevProps) {
    const { isHubLoading, history } = this.props;
    if (!isHubLoading && isHubLoading !== prevProps.isHubLoading) {
      history.replace('/hub/unprocessed');
    }
  }
  render() {
    if (this.props.isHubLoading) {
      return <HubLoader />;
    }
    return <Hub {...this.props} />;
  }
}
const HubLoader = () => <Spinner center size="m" />;

const Hub = () => (
  <div id="hub">
    <div id="hub__menu">
      <Menu />
    </div>
    <ScrollBox>
      <div id="hub__content">
        <Heading size="3">Hub Name</Heading>
        <Route path="/hub/endpoints" component={Endpoints} />
        <Route path="/hub/unprocessed" component={UnprocessedEndpoints} />
        <Route path="/hub/ca" component={CertificateAuthorities} />
        <Route path="/hub/tls/client" component={TLSClientCertificates} />
        <Route path="/hub/tls/server" component={TLSServerCertificates} />
        <Route path="/hub/dfsps" component={DFSPs} />
      </div>
    </ScrollBox>
  </div>
);

const ConneectedHUB = connect(
  stateProps,
  actionProps
)(HubWrapper);
export default withRouter(ConneectedHUB);
