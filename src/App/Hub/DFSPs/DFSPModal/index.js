import React from 'react';
import { connect } from 'react-redux';
import { Modal, FormInput } from 'components';
import {
  getMonetaryZoneOptions,
  getHubDfspModalName,
  getHubDfspModalId,
  getHubDfspModalMonetaryZoneId,
  getHubDfspModalEmail,
  getHubDfspModalValidationResult,
  getIsHubDfspModalVisible,
  getIsExistingDfsp,
  getIsHubDfspModalSubmitEnabled,
  getIsHubDfspModalSubmitPending,
} from './selectors';
import {
  closeHubDfspModal,
  submitHubDfspModal,
  setHubDfspModalName,
  setHubDfspModalId,
  setHubDfspModalMonetaryZone,
  setHubDfspModalEmail,
} from './actions';

import './index.css';

const stateProps = state => ({
  dfspName: getHubDfspModalName(state),
  dfspId: getHubDfspModalId(state),
  dfspMonetaryZoneId: getHubDfspModalMonetaryZoneId(state),
  dfspEmail: getHubDfspModalEmail(state),
  monetaryZoneOptions: getMonetaryZoneOptions(state),
  validation: getHubDfspModalValidationResult(state),
  isVisible: getIsHubDfspModalVisible(state),
  isExistingDfsp: getIsExistingDfsp(state),
  isSubmitEnabled: getIsHubDfspModalSubmitEnabled(state),
  isSubmitPending: getIsHubDfspModalSubmitPending(state),
});

const actionProps = dispatch => ({
  onClose: () => dispatch(closeHubDfspModal()),
  onSubmit: () => dispatch(submitHubDfspModal()),
  onNameChange: name => dispatch(setHubDfspModalName(name)),
  onIdChange: id => dispatch(setHubDfspModalId(id)),
  onMonetaryZoneChange: zone => dispatch(setHubDfspModalMonetaryZone(zone)),
  onEmailChange: email => dispatch(setHubDfspModalEmail(email)),
});

const DFSPModal = ({
  dfspName,
  dfspId,
  dfspMonetaryZoneId,
  dfspEmail,
  monetaryZoneOptions,
  validation,
  isExistingDfsp,
  isVisible,
  isSubmitEnabled,
  isSubmitPending,
  onNameChange,
  onIdChange,
  onMonetaryZoneChange,
  onEmailChange,
  onClose,
  onSubmit,
}) => {
  if (!isVisible) {
    return <div />;
  }

  return (
    <Modal
      id="dfsp-modal"
      title="Add DFSP"
      allowSubmit
      isSubmitEnabled={isSubmitEnabled}
      isSubmitPending={isSubmitPending}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <div className="dfsp-modal__content">
        <div className="dfsp-modal__dfsp-name">
          <FormInput
            type="text"
            label="Name"
            onChange={onNameChange}
            value={dfspName}
            validation={validation.fields.name}
          />
        </div>
        <div className="dfsp-modal__dfsp-id">
          <FormInput
            type="text"
            label="ID"
            disabled={isExistingDfsp}
            onChange={onIdChange}
            value={dfspId}
            validation={validation.fields.dfspId}
          />
        </div>
        <div className="dfsp-modal__dfsp-email">
          <FormInput
            type="text"
            label="Email"
            onChange={onEmailChange}
            value={dfspEmail}
            validation={validation.fields.email}
          />
        </div>
        <div className="dfsp-modal__dfsp-monetary-zone">
          <FormInput
            type="select"
            options={monetaryZoneOptions}
            label="Monetary Zone"
            onChange={onMonetaryZoneChange}
            value={dfspMonetaryZoneId}
            validation={validation.fields.monetaryZoneId}
          />
        </div>
      </div>
    </Modal>
  );
};
// validation={validation.fields.dfspName}

export default connect(stateProps, actionProps)(DFSPModal);
