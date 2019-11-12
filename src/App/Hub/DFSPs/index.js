import React from 'react';
import { connect } from 'react-redux';
import { Button, ControlIcon, DataList } from 'components';
import { getDfsps, getIsDfspsReadPending } from 'App/selectors';
import { getMonetaryZones } from 'App/MonetaryZones/selectors';
import DFSPModal from './DFSPModal';
import { openNewHubDfspModal, openExistingHubDfspModal } from './DFSPModal/actions';
import './index.css';

const stateProps = state => ({
  dfsps: getDfsps(state),
  monetaryZones: getMonetaryZones(state),
  isDfspsPending: getIsDfspsReadPending(state),
});
const actionProps = dispatch => ({
  onAddClick: () => dispatch(openNewHubDfspModal()),
  onEditClick: dfsp => dispatch(openExistingHubDfspModal(dfsp)),
});

const DFSPs = ({ dfsps, monetaryZones, isDfspsPending, onAddClick, onEditClick }) => {
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
    {
      label: 'Monetary Zone',
      key: 'monetaryZoneId',
      func: (id) => {
        const zone = monetaryZones.find(zone => zone.monetaryZoneId === id);
        if (zone) {
          return `${zone.monetaryZoneId} - ${zone.name}`;
        }
        return null;
      }
    },
    {
      label: '',
      key: 'id',
      sortable: false,
      searchable: false,
      func: (_, dfsp, index) => (
        <ControlIcon
          icon="edit-small"
          size={16}
          tooltip={`Edit ${dfsp.name}`}
          onClick={() => onEditClick(dfsp)}
          tooltipPosition="left"
        />
      ),
      className: 'icon-column',
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
