import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CertificateInfo,
  CertificateModal,
  ControlIcon,
  FileControls,
  FormInput,
  Icon,
  MessageBox,
} from 'components';
import {
  setHubCaCommonName,
  setHubCaOrganization,
  setHubCaOrganizationUnit,
  setHubCaLocality,
  setHubCaState,
  setHubCaCountry,
  changeHubCaHost,
  addHubCaHost,
  removeHubCaHost,
  submitHubCa,
  downloadHubCa,
  showHubCaModal,
  hideHubCaModal,
} from './actions';
import {
  getHubCaError,
  getHubCaCommonName,
  getHubCaOrganization,
  getHubCaOrganizationUnit,
  getHubCaLocality,
  getHubCaState,
  getHubCaCountry,
  getHubCaModelValidationResult,
  getHubCaHosts,
  getHubCaHostsValidationResult,
  getIsHubCaSubmitEnabled,
  getHubCaRootCertificate,
  getHubCaRootCertificateInfo,
  getIsHubCaModalVisible,
  getIsHubCaPending,
} from './selectors';

import './index.css';

const stateProps = state => ({
  error: getHubCaError(state),
  commonName: getHubCaCommonName(state),
  organization: getHubCaOrganization(state),
  organizationUnit: getHubCaOrganizationUnit(state),
  locality: getHubCaLocality(state),
  state: getHubCaState(state),
  country: getHubCaCountry(state),
  validation: getHubCaModelValidationResult(state),
  hosts: getHubCaHosts(state),
  hostValidation: getHubCaHostsValidationResult(state),
  isSubmitEnabled: getIsHubCaSubmitEnabled(state),
  rootCertificate: getHubCaRootCertificate(state),
  rootCertificateInfo: getHubCaRootCertificateInfo(state),
  isRootCertificateModalVisible: getIsHubCaModalVisible(state),
  isHubCaPending: getIsHubCaPending(state),
});

const actionProps = dispatch => ({
  onCommonNameChange: value => dispatch(setHubCaCommonName(value)),
  onOrganizationChange: value => dispatch(setHubCaOrganization(value)),
  onOrganizationUnitChange: value => dispatch(setHubCaOrganizationUnit(value)),
  onLocalityChange: value => dispatch(setHubCaLocality(value)),
  onStateChange: value => dispatch(setHubCaState(value)),
  onCountryChange: value => dispatch(setHubCaCountry(value)),
  onHostChange: (index, value) => dispatch(changeHubCaHost({ index, value })),
  onHostAddClick: () => dispatch(addHubCaHost()),
  onHostRemoveClick: index => dispatch(removeHubCaHost(index)),
  onCreateHubRootCertificateClick: () => dispatch(submitHubCa()),
  onRootCertificateViewClick: () => dispatch(showHubCaModal()),
  onRootCertificateDownloadClick: () => dispatch(downloadHubCa()),
  onRootCertificateModalCloseClick: () => dispatch(hideHubCaModal()),
});

const HubCertificateAuthority = ({
  error,
  commonName,
  organization,
  organizationUnit,
  locality,
  state,
  country,
  validation,
  hosts,
  hostValidation,
  isSubmitEnabled,
  rootCertificate,
  rootCertificateInfo,
  isRootCertificateModalVisible,
  isHubCaPending,
  onCommonNameChange,
  onOrganizationChange,
  onOrganizationUnitChange,
  onLocalityChange,
  onStateChange,
  onCountryChange,
  onHostChange,
  onHostAddClick,
  onHostRemoveClick,
  onCreateHubRootCertificateClick,
  onRootCertificateViewClick,
  onRootCertificateDownloadClick,
  onRootCertificateModalCloseClick,
}) => {
  if (error) {
    return (
      <MessageBox
        icon="warning-sign"
        kind="danger"
        message="There was an error while loading the certificates"
        center
        size={30}
        fontSize={17}
      />
    );
  }
  return (
    <div className="hub__hub-ca">
      <div className="hub__hub-ca__info-message">
        <Icon name="info-small" fill="#f49935" size={16} />
        <span className="hub__hub-ca__info-message__text">
          <b>Note: </b>
          If you do not generate a Root Certificate then we assume you will be using a well known external CA
        </span>
      </div>
      <div className="hub__hub-ca__root-certificate">
        <FormInput
          type="text"
          label="Root Certificate"
          elementWidth="400px"
          value={rootCertificate ? `root.pem` : 'No Certificate Created Yet'}
          icon={rootCertificate && 'documents'}
          disabled
        />
        {rootCertificate && (
          <FileControls onViewClick={onRootCertificateViewClick} onDownloadClick={onRootCertificateDownloadClick} />
        )}
      </div>
      {rootCertificateInfo && <CertificateInfo certInfo={rootCertificateInfo} />}
      <div className="hub__hub-ca__submit__container">
        <Button
          className="hub__hub-ca__submit"
          label="Generate CA"
          onClick={onCreateHubRootCertificateClick}
          disabled={!isSubmitEnabled}
          pending={isHubCaPending}
          icon="check-small"
        />
      </div>
      {!rootCertificate && (
        <div>
          <div className="hub__hub-ca__common-name">
            <FormInput
              type="text"
              label="Common Name"
              onChange={onCommonNameChange}
              value={commonName}
              validation={validation.fields.commonName}
            />
          </div>
          <div className="hub__hub-ca__organization">
            <FormInput
              type="text"
              label="Organization"
              onChange={onOrganizationChange}
              value={organization}
              validation={validation.fields.organization}
            />
          </div>
          <div className="hub__hub-ca__organization-unit">
            <FormInput
              type="text"
              label="Organization Unit"
              onChange={onOrganizationUnitChange}
              value={organizationUnit}
              validation={validation.fields.organizationUnit}
            />
          </div>
          <div className="hub__hub-ca__country">
            <FormInput
              type="text"
              label="Country"
              onChange={onCountryChange}
              value={country}
              validation={validation.fields.country}
            />
          </div>
          <div className="hub__hub-ca__state">
            <FormInput
              type="text"
              label="State"
              onChange={onStateChange}
              value={state}
              validation={validation.fields.state}
            />
          </div>
          <div className="hub__hub-ca__locality">
            <FormInput
              type="text"
              label="Locality"
              onChange={onLocalityChange}
              value={locality}
              validation={validation.fields.locality}
            />
          </div>

          <div className="hub__ca__section">
            <div className="hub__ca__section-subtitle">Hosts</div>
            <div className="hub__ca__host__add">
              <Button label="Add Host" icon="plus-small" noFill onClick={onHostAddClick} />
            </div>
            {hosts.map((host, index) => (
              <HOST
                key={index}
                index={index}
                value={host}
                validation={hostValidation[index]}
                onChange={value => onHostChange(index, value)}
                onRemove={() => onHostRemoveClick(index)}
              />
            ))}
          </div>
        </div>
      )}

      {isRootCertificateModalVisible && (
        <CertificateModal
          onClose={onRootCertificateModalCloseClick}
          content={rootCertificate}
          title="Root Certificate"
        />
      )}
    </div>
  );
};

const HOST = ({ value, validation, onChange, onRemove }) => (
  <div className="hub__ca__host__row">
    <ControlIcon
      icon="close-small"
      className="hub__ca__host__remove"
      size={20}
      tooltip="Remove Host"
      kind="danger"
      onClick={onRemove}
    />
    <div className="hub__ca__host__value">
      <FormInput type="text" placeholder="Host" value={value} onChange={onChange} validation={validation} />
    </div>
  </div>
);

export default connect(stateProps, actionProps)(HubCertificateAuthority);
