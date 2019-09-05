import React from 'react';
import { connect } from 'react-redux';
import { Button, DataList } from 'components';
import { getDfsps, getIsDfspsReadPending } from 'App/selectors';
import DFSPModal from './DFSPModal';
import { showHubDfspModal } from './DFSPModal/actions';
import './index.css';

const stateProps = state => ({
  dfsps: getDfsps(state),
  isDfspsPending: getIsDfspsReadPending(state),
});
const actionProps = dispatch => ({
  onAddClick: () => dispatch(showHubDfspModal()),
});

const DFSPs = ({ dfsps, isDfspsPending, onAddClick }) => {
  const columns = [
    {
      label: 'Id',
      key: 'id',
      className: 'hub__dfsps__id',
    },
    {
      label: 'Name',
      key: 'name',
      className: 'hub__dfsps__name',
    },
    {
      label: 'Security Group',
      key: 'securityGroup',
      className: 'hub__dfsps__security-group',
    },
  ];
  return (
    <div className="hub__dfsps">
      <Button label="Add DFSP" onClick={onAddClick} />
      <div className="hub__dfsps__list">
        <DataList list={dfsps} columns={columns} isPending={isDfspsPending} />
        <DFSPModal />
      </div>
    </div>
  );
};

export default connect(
  stateProps,
  actionProps
)(DFSPs);
