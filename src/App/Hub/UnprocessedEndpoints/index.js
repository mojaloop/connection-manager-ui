import React from 'react';
import { connect } from 'react-redux';
import { Button, MessageBox, Heading, Spinner, Status, TextField } from 'components';
import { withMount } from 'utils/hocs';
import EndpointEntry from './EndpointEntry';
import './Unprocessed.css';

import {
  getIsUnprocessedEndpointsLoading,
  getHubUnprocessedEndpointsError,
  getUnprocessedEndpointsFilter,
  getHubUnprocessedEndpointsByDFSP,
} from './selectors';
import {
  storeUnprocessedEndpoints,
  changeUnprocessedEndpointsFilter,
  changeHubUnprocessedEndpointSelection,
  submitUnprocessedEndpoints,
} from './actions';

const stateProps = state => ({
  unprocessedEndpointsError: getHubUnprocessedEndpointsError(state),
  isUnprocessedEndpointsLoading: getIsUnprocessedEndpointsLoading(state),
  unprocessedEndpointsFilter: getUnprocessedEndpointsFilter(state),
  unprocessedEndpointsByDFSP: getHubUnprocessedEndpointsByDFSP(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeUnprocessedEndpoints()),
  onUnprocessedEndpointsFilterChange: value => dispatch(changeUnprocessedEndpointsFilter(value)),
  onUnprocessedEndpointChange: (checked, id) => dispatch(changeHubUnprocessedEndpointSelection({ checked, id })),
  onUnprocessedEndpointsSubmit: (direction, dfspId) => dispatch(submitUnprocessedEndpoints({ direction, dfspId })),
});

const Unprocessed = ({
  unprocessedEndpointsError,
  isUnprocessedEndpointsLoading,
  unprocessedEndpointsFilter,
  unprocessedEndpointsByDFSP,
  onUnprocessedEndpointsFilterChange,
  onUnprocessedEndpointChange,
  onUnprocessedEndpointsSubmit,
}) => {
  return (
    <div>
      <Heading size="5">DFSP Endpoints</Heading>
      <UnprocessedDFSPEndpointsFilter
        value={unprocessedEndpointsFilter}
        onChange={onUnprocessedEndpointsFilterChange}
      />
      <UnprocessedContent
        unprocessedEndpointsError={unprocessedEndpointsError}
        isUnprocessedEndpointsLoading={isUnprocessedEndpointsLoading}
        unprocessedEndpointsByDFSP={unprocessedEndpointsByDFSP}
        onUnprocessedEndpointChange={onUnprocessedEndpointChange}
        onUnprocessedEndpointsSubmit={onUnprocessedEndpointsSubmit}
      />
    </div>
  );
};

const UnprocessedContent = ({
  unprocessedEndpointsError,
  isUnprocessedEndpointsLoading,
  unprocessedEndpointsByDFSP,
  onUnprocessedEndpointChange,
  onUnprocessedEndpointsSubmit,
}) => {
  if (unprocessedEndpointsError) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="danger"
        message="There was an error while loading the endpoints"
        center
        size={30}
        fontSize={17}
      />
    );
  } else if (isUnprocessedEndpointsLoading) {
    return <UnprocessedDFSPEndpointsLoader />;
  } else if (!unprocessedEndpointsByDFSP.length) {
    return (
      <MessageBox
        icon="info-small"
        kind="default"
        message="There are no endpoints to confirm"
        size={30}
        fontSize={17}
        center
      />
    );
  }
  return unprocessedEndpointsByDFSP.map((dfspUnprocessedEndpoints, index) => (
    <UnprocessedDFSPEndpoints
      key={index}
      index={index}
      dfspId={dfspUnprocessedEndpoints.dfspId}
      dfspName={dfspUnprocessedEndpoints.dfspName}
      endpoints={dfspUnprocessedEndpoints}
      onUnprocessedEndpointChange={onUnprocessedEndpointChange}
      onUnprocessedEndpointsSubmit={onUnprocessedEndpointsSubmit}
    />
  ));
};

const UnprocessedDFSPEndpointsLoader = () => <Spinner center size={20} />;

const UnprocessedDFSPEndpointsFilter = ({ value, onChange }) => (
  <div className="unprocessed-dfsp-endpoints__filter">
    <TextField placeholder="Search DFSP Endpoints" value={value} onChange={onChange} />
  </div>
);

const UnprocessedDFSPEndpoints = ({
  index,
  dfspId,
  dfspName,
  endpoints,
  onUnprocessedEndpointChange,
  onUnprocessedEndpointsSubmit,
}) => (
  <div className="unprocessed-dfsp-endpoints__row">
    <div className="unprocessed-dfsp-endpoints__header">
      <div className="unprocessed-dfsp-endpoints__header__names">
        <div className="unprocessed-dfsp-endpoints__dfsp-name">{dfspName}</div>
      </div>
      <Status.Endpoint state="NEW" />
    </div>
    <div className="unprocessed-dfsp-endpoints__body">
      <UnprocessedEndpointsSection
        direction="egress"
        title="Egress Endpoints"
        endpoints={endpoints.egress}
        onChange={onUnprocessedEndpointChange}
      />
      <UnprocessedEndpointsSection
        direction="ingress"
        title="Ingress Endpoints"
        endpoints={endpoints.ingress}
        onChange={onUnprocessedEndpointChange}
      />
    </div>
    <div className="unprocessed-dfsp-endpoints__footer">
      <div className="unprocessed-dfsp-endpoints__footer__section">
        <Button
          label="Confirm Selected Endpoints"
          disabled={!endpoints.isEgressSubmitEnabled}
          onClick={() => onUnprocessedEndpointsSubmit('egress', dfspId)}
        />
      </div>
      <div className="unprocessed-dfsp-endpoints__footer__section">
        <Button
          label="Confirm Selected Endpoints"
          disabled={!endpoints.isIngressSubmitEnabled}
          onClick={() => onUnprocessedEndpointsSubmit('ingress', dfspId)}
        />
      </div>
    </div>
  </div>
);

const UnprocessedEndpointsSection = ({ title, endpoints, isSubmitEnabled, onChange }) => (
  <div className="unprocessed-dfsp-endpoints__body__section">
    <div className="unprocessed-dfsp-endpoints__body__section__title">{title}</div>
    <div>
      {endpoints.map((endpoint, index) => (
        <EndpointEntry
          type={endpoint.type}
          value={endpoint.value}
          id={endpoint.id}
          key={index}
          onChange={onChange}
          checked={endpoint.checked}
        />
      ))}
    </div>
  </div>
);

const MountedUnprocessedEndpoints = withMount(Unprocessed, 'onMount');
export default connect(stateProps, actionProps)(MountedUnprocessedEndpoints);
