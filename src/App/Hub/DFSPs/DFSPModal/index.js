import React from 'react';
import { connect } from 'react-redux';
import { Modal, FormInput } from 'components';
import {
  getHubDfspModalName,
  getHubDfspModalId,
  getHubDfspModalValidationResult,
  getIsHubDfspModalVisible,
  getIsHubDfspModalSubmitEnabled,
  getIsHubDfspCreatePending,
} from './selectors';
import { closeHubDfspModal, submitHubDfspModal, setHubDfspModalName, setHubDfspModalId } from './actions';

import './index.css';

const stateProps = state => ({
  dfspName: getHubDfspModalName(state),
  dfspId: getHubDfspModalId(state),
  validation: getHubDfspModalValidationResult(state),
  isVisible: getIsHubDfspModalVisible(state),
  isSubmitEnabled: getIsHubDfspModalSubmitEnabled(state),
  isSubmitPending: getIsHubDfspCreatePending(state),
});

const actionProps = dispatch => ({
  onClose: () => dispatch(closeHubDfspModal()),
  onSubmit: () => dispatch(submitHubDfspModal()),
  onNameChange: name => dispatch(setHubDfspModalName(name)),
  onIdChange: id => dispatch(setHubDfspModalId(id)),
});

const DFSPModal = ({
  dfspName,
  dfspId,
  validation,
  isVisible,
  isSubmitEnabled,
  isSubmitPending,
  onNameChange,
  onIdChange,
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
            onChange={onIdChange}
            value={dfspId}
            validation={validation.fields.dfspId}
          />
        </div>
      </div>
    </Modal>
  );
};
// validation={validation.fields.dfspName}

export default connect(
  stateProps,
  actionProps
)(DFSPModal);
