import React from 'react';
import { Spinner } from 'components';
import './index.css';

const PendingOverlay = () => (
  <div className="pending-overlay">
    <Spinner size={20} className="pending-overlay__spinner" />
  </div>
);

export default PendingOverlay;
