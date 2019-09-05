import React from 'react';
import { composeClassName } from 'utils/html';
import './Status.css';

const UNSET = 'UNSET';
const NEW = 'NEW';
const CONFIRMED = 'CONFIRMED';
const CSR_LOADED = 'CSR_LOADED';
const CERT_SIGNED = 'CERT_SIGNED';
const INVALID = 'INVALID';
const VALID = 'VALID';

const LEDS = {
  GRAY: 'gray',
  GREEN: 'green',
  YELLOW: 'yellow',
  BLUE: 'blue',
  RED: 'red',
};

const getStateClassname = (state, type) => {
  const states = {
    [`ENDPOINT_${UNSET}`]: LEDS.GRAY,
    [`ENDPOINT_${NEW}`]: LEDS.YELLOW,
    [`ENDPOINT_${CONFIRMED}`]: LEDS.GREEN,
    [`CSR_${NEW}`]: LEDS.YELLOW,
    [`CSR_${CSR_LOADED}`]: LEDS.YELLOW,
    [`CSR_${CERT_SIGNED}`]: LEDS.GREEN,
    [`CSR_${INVALID}`]: LEDS.RED,
    [`CSR_${VALID}`]: LEDS.GREEN,
  };
  return states[`${type}_${state}`] || LEDS.GRAY;
};

const getStateMessage = (state, type) => {
  const states = {
    [`ENDPOINT_${UNSET}`]: 'Not yet sent for processing',
    [`ENDPOINT_${NEW}`]: 'Awaiting Processing',
    [`ENDPOINT_${CONFIRMED}`]: 'Processed and Confirmed',
    [`ENDPOINT_UNAVAILABLE`]: 'Unable to get Endpoint Status',
    [`CSR_${NEW}`]: 'Not sure',
    [`CSR_${CSR_LOADED}`]: 'CSR created',
    [`CSR_${CERT_SIGNED}`]: 'Certificate created',
    [`CSR_${INVALID}`]: 'CSR Invalid',
    [`CSR_${VALID}`]: 'Certificate Validated',
    [`CSR_UNAVAILABLE`]: 'Unable to get CSR Status',
  };
  return states[`${type}_${state}`] || states[`${type}_UNAVAILABLE`] || 'Unable to get Status';
};

const StatusComponent = ({ state, type }) => {
  const className = composeClassName(['status__info__led', `status__info__led--${getStateClassname(state, type)}`]);
  const message = getStateMessage(state, type);
  return (
    <div className="status__info">
      <div className="status__info__label">Status: </div>
      <div className={className} />
      <div className="status__info__text">{message}</div>
    </div>
  );
};

const CSR = ({ state }) => <StatusComponent state={state} type="CSR" />;
const Endpoint = ({ state }) => <StatusComponent state={state} type="ENDPOINT" />;

const Status = { Endpoint, CSR };

export default Status;
