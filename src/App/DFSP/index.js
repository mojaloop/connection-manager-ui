import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { Heading, Spinner, ScrollBox } from 'components';
import Menu from './Menu';
import Endpoints from './Endpoints';
import HubEndpoints from './HubEndpoints';
import CertificateAuthorities from './CertificateAuthorities';
import TLSClientCertificates from './TLSClientCertificates';
import TLSServerCertificates from './TLSServerCertificates';
import JWSCertificates from './JWSCertificates';
import './DFSP.css';

import { getDfspName } from 'App/selectors';
import { getIsDfspLoading } from './selectors';
import { initDfsp } from './actions';

const stateProps = state => ({
  dfspName: getDfspName(state),
  isDfspLoading: getIsDfspLoading(state),
});

const actionProps = dispatch => ({
  initDfsp: () => dispatch(initDfsp()),
});

class DFSPWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.props.initDfsp();
  }
  componentDidUpdate(prevProps) {
    const { isDfspLoading, history } = this.props;
    if (!isDfspLoading && isDfspLoading !== prevProps.isDfspLoading) {
      history.replace('/dfsp/endpoints');
    }
  }
  render() {
    if (this.props.isDfspLoading) {
      return <DFSPLoader />;
    }
    return <DFSP {...this.props} />;
  }
}

const DFSPLoader = () => <Spinner center size="m" />;

const DFSP = ({ dfspName }) => (
  <div id="dfsp">
    <div id="dfsp__menu">
      <Menu />
    </div>
    <ScrollBox>
      <div id="dfsp__content">
        <Heading size="3">{dfspName}</Heading>
        <Route path="/dfsp/endpoints" component={Endpoints} />
        <Route path="/dfsp/hubEndpoints" component={HubEndpoints} />
        <Route path="/dfsp/ca" component={CertificateAuthorities} />
        <Route path="/dfsp/tls/client" component={TLSClientCertificates} />
        <Route path="/dfsp/tls/server" component={TLSServerCertificates} />
        <Route path="/dfsp/jws" component={JWSCertificates} />
      </div>
    </ScrollBox>
  </div>
);

const ConneectedDFSP = connect(
  stateProps,
  actionProps
)(DFSPWrapper);
export default withRouter(ConneectedDFSP);
