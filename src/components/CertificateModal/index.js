import React from 'react';
import { Modal, ContentReader } from 'components';

const CertificateModal = ({ onClose, title, content }) => (
  <Modal title={title} onClose={onClose} primaryAction="Close" width="800px" flex>
    <ContentReader data={content} style={{ height: '300px' }} />
  </Modal>
);
export default CertificateModal;
