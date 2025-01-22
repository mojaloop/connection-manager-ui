import React from 'react';
import { connect } from 'react-redux';
import { Button, ControlIcon, FormInput, MessageBox, Spinner, Status } from 'components';
import { withMount } from 'utils/hocs';
import './Ingress.css';
import {
  getIngressError,
  getIngressUrls,
  getIngressIps,
  getIngressUrlsValidationResult,
  getIngressIpsValidationResult,
  getIsIngressPending,
  getIsIngressSubmitEnabled,
  getIsIngressSubmitPending,
  getIsIngressChanged,
} from './selectors';
import {
  storeHubEndpoints,
  addHubIngressIp,
  removeHubIngressIp,
  changeHubIngressUrl,
  changeHubIngressAddress,
  changeHubIngressPort,
  addHubIngressPort,
  removeHubIngressPort,
  submitHubIngressEndpoints,
  undoHubIngressChanges,
} from './actions';

const stateProps = state => ({
  error: getIngressError(state),
  urls: getIngressUrls(state),
  ips: getIngressIps(state),
  urlsValidation: getIngressUrlsValidationResult(state),
  ipsValidation: getIngressIpsValidationResult(state),
  isPending: getIsIngressPending(state),
  isSubmitEnabled: getIsIngressSubmitEnabled(state),
  isSubmitPending: getIsIngressSubmitPending(state),
  isChanged: getIsIngressChanged(state),
});

const actionProps = dispatch => ({
  onMount: () => dispatch(storeHubEndpoints()),
  onAddIpClick: () => dispatch(addHubIngressIp()),
  onRemoveIpClick: index => dispatch(removeHubIngressIp(index)),
  onChangeUrl: (url, index) => dispatch(changeHubIngressUrl({ url, index })),
  onChangeAddress: (address, index) => dispatch(changeHubIngressAddress({ address, index })),
  onChangePort: (port, portIndex, index) => dispatch(changeHubIngressPort({ port, portIndex, index })),
  onAddPortClick: index => dispatch(addHubIngressPort(index)),
  onRemovePortClick: (portIndex, index) => dispatch(removeHubIngressPort({ portIndex, index })),
  onSubmitClick: () => dispatch(submitHubIngressEndpoints()),
  onUndoClick: () => dispatch(undoHubIngressChanges()),
});

const Ingress = ({
  error,
  ips,
  urls,
  urlsValidation,
  ipsValidation,
  isPending,
  isSubmitEnabled,
  isSubmitPending,
  isChanged,
  onAddIpClick,
  onChangeUrl,
  onChangeAddress,
  onChangePort,
  onAddPortClick,
  onRemovePortClick,
  onRemoveIpClick,
  onSubmitClick,
  onUndoClick,
}) => {
  if (isPending) {
    return <Spinner center size={20} />;
  } else if (error) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="danger"
        message="There was an error while loading the endpoints"
        center
        size={30}
        fontSize={17}
      />
    );
  }
  return (
    <div>
      <div className="hub-ingress____buttons">
        <Button
          className="hub-ingress____button"
          label="Submit for Confirmation"
          disabled={!isSubmitEnabled}
          onClick={onSubmitClick}
          pending={isSubmitPending}
        />
        <Button
          className="hub-ingress____button"
          label="Add Additional IP Address"
          icon="plus-small"
          noFill
          onClick={onAddIpClick}
        />
        <Button
          className="hub-ingress____button"
          label="Undo Changes"
          disabled={!isChanged}
          onClick={onUndoClick}
          kind="secondary"
          noFill
        />
      </div>

      <div className="hub-ingress__url__container">
        <div className="hub-ingress__url">
          <FormInput
            type="text"
            placeholder="URL"
            value={urls[0].url}
            onChange={value => onChangeUrl(value, 0)}
            validation={urlsValidation[0]}
          />
          <div className="hub-ingress__url__status__container">
            <Status.Endpoint state={urls[0].state} />
          </div>
        </div>
      </div>

      {ips.map((ingressIp, index) => (
        <IngressIp
          address={ingressIp.address}
          ports={ingressIp.ports}
          state={ingressIp.state}
          onChangeAddress={onChangeAddress}
          onChangePort={onChangePort}
          onAddPort={onAddPortClick}
          onRemovePort={onRemovePortClick}
          onRemoveIp={onRemoveIpClick}
          validation={ipsValidation}
          index={index}
          key={index}
        />
      ))}
    </div>
  );
};

const IngressIp = ({
  index,
  state,
  address,
  ports,
  validation,
  onChangeAddress,
  onChangePort,
  onAddPort,
  onRemovePort,
  onRemoveIp,
}) => (
  <div className="hub-ingress__ip__row">
    <div className="hub-ingress__ip__remove">
      <ControlIcon
        icon="close-small"
        size={20}
        tooltip={index === 0 ? 'The first IP cannot be removed' : 'Remove IP'}
        kind="danger"
        onClick={() => onRemoveIp(index)}
        disabled={index === 0}
      />
    </div>
    <div className="hub-ingress__ip__controls">
      <div className="hub-ingress__ip__fields">
        <div className="hub-ingress__ip__address__container">
          <div className="hub-ingress__ip__address">
            <FormInput
              type="text"
              placeholder="Ingress IP Address"
              value={address}
              onChange={address => onChangeAddress(address, index)}
              validation={validation[index].address}
            />
          </div>
        </div>
        {ports.map((port, portIndex) => (
          <div className="hub-ingress__ip__port__container" key={portIndex}>
            <div className="hub-ingress__ip__port">
              <FormInput
                type="text"
                placeholder="Port(s)"
                value={port}
                onChange={value => onChangePort(value, portIndex, index)}
                validation={validation[index].ports[portIndex]}
              />
            </div>
            {portIndex > 0 && (
              <ControlIcon
                icon="close-small"
                className="hub-ingress__ip__port-remove"
                size={16}
                tooltip="Remove Port"
                kind="danger"
                onClick={() => onRemovePort(portIndex, index)}
                disabled={portIndex === 0}
              />
            )}
          </div>
        ))}
        <Button
          label="Add Port"
          icon="plus-small"
          className="hub-ingress__ip__port-add"
          onClick={() => onAddPort(index)}
          noFill
        />
      </div>
      <div className="hub-ingress__status__container">
        <Status.Endpoint state={state} />
      </div>
    </div>
  </div>
);

const MountedIngress = withMount(Ingress, 'onMount');

export default connect(stateProps, actionProps)(MountedIngress);
