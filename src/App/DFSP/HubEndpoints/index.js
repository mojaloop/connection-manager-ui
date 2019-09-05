import React from 'react';
import { connect } from 'react-redux';
import { MessageBox, Heading, Spinner } from 'components';
import { withMount } from 'utils/hocs';
import EndpointEntry from './EndpointEntry';
import './DfspHubEndpoints.css';

import {
  getIsDfspHubEndpointsLoading,
  getDfspHubEndpointsEndpointsError,
  getDfspHubEndpointsPerDirection,
} from './selectors';
import { storeDfspHubEndpoints } from './actions';

const stateProps = state => ({
  endpointsError: getDfspHubEndpointsEndpointsError(state),
  isEndpointsLoading: getIsDfspHubEndpointsLoading(state),
  endpoints: getDfspHubEndpointsPerDirection(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeDfspHubEndpoints()),
});

const DfspHubEndpoints = ({ endpointsError, isEndpointsLoading, endpoints }) => {
  return (
    <div>
      <Heading size="5">Hub Endpoints</Heading>
      <DfspHubEndpointsContent
        endpointsError={endpointsError}
        isEndpointsLoading={isEndpointsLoading}
        endpoints={endpoints}
      />
    </div>
  );
};

const DfspHubEndpointsContent = ({ endpointsError, isEndpointsLoading, endpoints }) => {
  if (endpointsError) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="error"
        message="There was an error while loading the endpoints"
        center
        size={30}
        fontSize={17}
      />
    );
  } else if (isEndpointsLoading) {
    return <DfspHubEndpointsLoader />;
  } else if (!endpoints.ingress.length && !endpoints.egress.length) {
    return (
      <MessageBox icon="info-small" kind="default" message="There are no endpoints" size={30} fontSize={17} center />
    );
  }
  return (
    <div className="dfsp__hub-endpoints__row">
      <div className="dfsp__hub-endpoints__header">
        <div className="dfsp__hub-endpoints__header__names">
          <div className="dfsp__hub-endpoints__hub-name">HUB NAME</div>
        </div>
      </div>
      <div className="dfsp__hub-endpoints__body">
        <DfspHubEndpointsSection direction="egress" title="Egress Endpoints" endpoints={endpoints.egress} />
        <DfspHubEndpointsSection direction="ingress" title="Ingress Endpoints" endpoints={endpoints.ingress} />
      </div>
      <div className="dfsp__hub-endpoints__footer" />
    </div>
  );
};

const DfspHubEndpointsLoader = () => <Spinner center size={20} />;

const DfspHubEndpointsSection = ({ title, endpoints }) => (
  <div className="dfsp__hub-endpoints__body__section">
    <div className="dfsp__hub-endpoints__body__section__title">{title}</div>
    <div>
      {endpoints.map((endpoint, index) => (
        <EndpointEntry type={endpoint.type} value={endpoint.value} key={index} />
      ))}
    </div>
  </div>
);

const MountedDfspHubEndpoints = withMount(DfspHubEndpoints, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedDfspHubEndpoints);
