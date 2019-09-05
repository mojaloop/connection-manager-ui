import React from 'react';
import { TYPES } from '../../constants';
import './EndpointEntry.css';

const EndpointDetail = ({ title, value }) => (
  <div className="endpoint__entry__detail">
    <span className="endpoint__entry__title">{title}:</span>
    <span className="endpoint__entry__value">{value}</span>
  </div>
);
const EndpointDetails = ({ type, value }) => {
  if (type === TYPES.IP) {
    return [
      <EndpointDetail title="IP" value={value.address} key="ip" />,
      <EndpointDetail title={`Port${value.ports.length > 1 ? 's' : ''}`} value={value.ports.join(', ')} key="ports" />,
    ];
  }
  return <EndpointDetail title="URL" value={value.url} />;
};

const EndpointEntry = ({ type, value }) => (
  <div className="endpoint__entry">
    <EndpointDetails type={type} value={value} />
  </div>
);

export default EndpointEntry;
