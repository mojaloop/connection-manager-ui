import React from 'react';
import { Button } from 'components';
import './index.css';

const FileControls = ({ onViewClick, onDownloadClick, downloadDisabled }) => (
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
        disabled={downloadDisabled}
      />
    )}
  </div>
);

export default FileControls;
