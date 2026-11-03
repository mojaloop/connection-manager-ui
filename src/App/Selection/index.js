import React from 'react';
import { connect } from 'react-redux';
import './Selection.css';
import { MessageBox, Spinner } from 'components';
import { withMount } from 'utils/hocs';
import { selectHub, selectDFSP } from './actions';
import { getIsDfspsReadPending, getDfsps } from 'App/selectors';
import { getHoldingsError, getIsHubOperator, getMaySeeDfsps } from 'Auth/selectors';
import { HOLDINGS_MESSAGES } from 'Auth/constants';

const stateProps = state => ({
  dfsps: getDfsps(state),
  isDfspsPending: getIsDfspsReadPending(state),
  holdingsError: getHoldingsError(state),
  isHubOperator: getIsHubOperator(state),
  maySeeDfsps: getMaySeeDfsps(state),
});
const actionProps = dispatch => ({
  onHubClick: () => dispatch(selectHub()),
  onDFSPClick: id => dispatch(selectDFSP(id)),
});

const Selection = ({ dfsps, isDfspsPending, holdingsError, isHubOperator, maySeeDfsps, onHubClick, onDFSPClick }) => {
  return (
    <AppSelection
      isPending={isDfspsPending}
      dfsps={dfsps}
      holdingsError={holdingsError}
      isHubOperator={isHubOperator}
      maySeeDfsps={maySeeDfsps}
      onHubClick={onHubClick}
      onDFSPClick={onDFSPClick}
    />
  );
};

const AppSelection = ({ isPending, dfsps, holdingsError, isHubOperator, maySeeDfsps, onHubClick, onDFSPClick }) => {
  if (isPending) {
    return <Spinner size={20} center />;
  }
  if (holdingsError) {
    return <SelectionMessage kind="danger" icon="warning-sign" message={holdingsError} />;
  }
  if (!maySeeDfsps) {
    return <SelectionMessage kind="default" icon="info-small" message={HOLDINGS_MESSAGES.NONE} />;
  }
  return (
    <div className="selection">
      {isHubOperator && (
        <div className="selection__hub-row">
          <SelectionItem className="selection__item--hub" onClick={onHubClick} type="HUB" label="HUB" />
        </div>
      )}
      <div className="selection__dfsps-container">
        <div className="selection__dfsps-grid">
          {dfsps.map((dfsp, index) => (
            <SelectionItem key={index} onClick={() => onDFSPClick(dfsp.id)} type="DFSP" label={dfsp.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SelectionMessage = ({ kind, icon, message }) => (
  <div className="selection">
    <MessageBox kind={kind} icon={icon} message={message} size={30} fontSize={17} center />
  </div>
);

const SelectionItem = ({ className = '', onClick, type, label }) => (
  <div className={`selection__item ${className}`} onClick={onClick}>
    <div className="selection__item__type">{type}</div>
    <div className="selection__item__label">{label}</div>
  </div>
);

const MountedSelection = withMount(Selection, 'onMount');
export default connect(stateProps, actionProps)(MountedSelection);
export { AppSelection };
