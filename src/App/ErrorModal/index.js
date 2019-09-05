import React from 'react';
import { Icon, Modal } from 'components';
import './ErrorModal.css';

const ErrorModal = ({ isVisible, content, onClose }) => {
  if (!isVisible) {
    return <div />;
  }

  return (
    <Modal onClose={onClose} id="error-modal" kind="danger">
      <div className="error-modal__content">
        <Icon name="warning-sign" size={50} className="error-modal__icon" />
        <p className="error-modal__message">{content}</p>
      </div>
    </Modal>
  );
};

export default ErrorModal;
