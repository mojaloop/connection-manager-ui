import React from 'react';
import { Button } from 'components';
import './index.css';

const FileControls = ({ onViewClick, onDownloadClick }) => (
  <div className="file-controls">
    {onViewClick && (
      <Button
        className="file-controls__button"
        icon="studio-project-small"
        label="View"
        kind="secondary"
        noFill
        size="m"
        onClick={onViewClick}
      />
    )}
    {onDownloadClick && (
      <Button
        className="file-controls__button"
        icon="download-small"
        label="Download"
        noFill
        size="m"
        onClick={onDownloadClick}
      />
    )}
  </div>
);

export default FileControls;
