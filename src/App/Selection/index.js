import React from 'react';
import { connect } from 'react-redux';
import './Selection.css';
import { Spinner } from 'components';
import { withMount } from 'utils/hocs';
import { selectHub, selectDFSP, selectEnvironment, clearEnvironment } from './actions';
import { getIsDfspsReadPending, getDfsps, getEnvironments, getEnvironmentName } from 'App/selectors';
import { getIsAuthDisabled } from 'Auth/selectors';

const stateProps = state => ({
  dfsps: getDfsps(state),
  environments: getEnvironments(state),
  environmentName: getEnvironmentName(state),
  isDfspsPending: getIsDfspsReadPending(state),
  isAuthDisabled: getIsAuthDisabled(state),
});
const actionProps = dispatch => ({
  onMount: () => dispatch(clearEnvironment()),
  onHubClick: () => dispatch(selectHub()),
  onDFSPClick: id => dispatch(selectDFSP(id)),
  onEnvironmentClick: id => dispatch(selectEnvironment(id)),
});

const Selection = ({
  dfsps,
  environments,
  environmentName,
  isDfspsPending,
  isAuthDisabled,
  onHubClick,
  onDFSPClick,
  onEnvironmentClick,
}) => {
  if (!environmentName) {
    return <EnvironmentSelection environments={environments} onEnvironmentClick={onEnvironmentClick} />;
  }
  if (isAuthDisabled) {
    return <AppSelection isPending={isDfspsPending} dfsps={dfsps} onHubClick={onHubClick} onDFSPClick={onDFSPClick} />;
  }
  return <Spinner size={20} center />;
};

const EnvironmentSelection = ({ environments, onEnvironmentClick }) => (
  <div className="selection">
    <div className="selection__row">
      {environments.map((environment, index) => (
        <SelectionItem
          key={index}
          onClick={() => onEnvironmentClick(environment.id)}
          type="Environment"
          label={environment.name}
        />
      ))}
    </div>
  </div>
);

const AppSelection = ({ isPending, dfsps, onHubClick, onDFSPClick }) => {
  if (isPending) {
    return <Spinner size={20} center />;
  }
  return (
    <div className="selection">
      <div className="selection__row">
        <SelectionItem className="selection__item--hub" onClick={onHubClick} type="HUB" label="HUB" />
      </div>
      <div className="selection__row">
        {dfsps.map((dfsp, index) => (
          <SelectionItem key={index} onClick={() => onDFSPClick(dfsp.id)} type="DFSP" label={dfsp.name} />
        ))}
      </div>
    </div>
  );
};

const SelectionItem = ({ className = '', onClick, type, label }) => (
  <div className={`selection__item ${className}`} onClick={onClick}>
    <div className="selection__item__type">{type}</div>
    <div className="selection__item__label">{label}</div>
  </div>
);

const MountedSelection = withMount(Selection, 'onMount');
export default connect(
  stateProps,
  actionProps
)(MountedSelection);
