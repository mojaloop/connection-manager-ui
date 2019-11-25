import React from 'react';
import { connect } from 'react-redux';
import { Button, CertificateModal, ControlIcon, FileControls, FormInput } from 'components';
import {
  setHubCsrDfspId,
  setHubCsrCertificate,
  setHubCsrCsrType,
  setHubCsrCommonName,
  setHubCsrOrganization,
  setHubCsrOrganizationUnit,
  setHubCsrEmail,
  setHubCsrLocality,
  setHubCsrCountry,
  setHubCsrState,
  showHubCsrModal,
  hideHubCsrModal,
  changeHubCsrDns,
  addHubCsrDns,
  removeHubCsrDns,
  changeHubCsrIp,
  addHubCsrIp,
  removeHubCsrIp,
  submitHubCsr,
} from './actions';
import {
  getHubCsrDfspsOptions,
  getHubCsrDfspId,
  getHubCsrCertificate,
  getHubCsrCsrType,
  getCsrTypeOptions,
  getHubCsrCommonName,
  getHubCsrOrganization,
  getHubCsrOrganizationUnit,
  getHubCsrEmail,
  getHubCsrLocality,
  getHubCsrCountry,
  getHubCsrState,
  getHubCsrDnss,
  getHubCsrDnssValidationResult,
  getHubCsrIps,
  getHubCsrIpsValidationResult,
  getHubCsrSubjectValidationResult,
  getIsHubCsrModalVisible,
  getIsHubCsrSubmitEnabled,
  getIsHubCsrSubmitPending,
} from './selectors';
import { CSR_TYPES } from './constants';

import './index.css';

const stateProps = state => ({
  dfspsOptions: getHubCsrDfspsOptions(state),
  dfspId: getHubCsrDfspId(state),
  certificate: getHubCsrCertificate(state),
  csrType: getHubCsrCsrType(state),
  csrTypeOptions: getCsrTypeOptions(state),
  commonName: getHubCsrCommonName(state),
  organization: getHubCsrOrganization(state),
  organizationUnit: getHubCsrOrganizationUnit(state),
  email: getHubCsrEmail(state),
  locality: getHubCsrLocality(state),
  country: getHubCsrCountry(state),
  state: getHubCsrState(state),
  validation: getHubCsrSubjectValidationResult(state),
  dnss: getHubCsrDnss(state),
  dnsValidation: getHubCsrDnssValidationResult(state),
  ips: getHubCsrIps(state),
  ipValidation: getHubCsrIpsValidationResult(state),
  isModalVisible: getIsHubCsrModalVisible(state),
  isSubmitEnabled: getIsHubCsrSubmitEnabled(state),
  isSubmitPending: getIsHubCsrSubmitPending(state),
});

const actionProps = dispatch => ({
  onDfspChange: dfspId => dispatch(setHubCsrDfspId(dfspId)),
  onCertificateChange: cert => dispatch(setHubCsrCertificate(cert)),
  onViewClick: () => dispatch(showHubCsrModal()),
  onModalCloseClick: () => dispatch(hideHubCsrModal()),
  onCsrTypeChange: value => dispatch(setHubCsrCsrType(value)),
  onCommonNameChange: value => dispatch(setHubCsrCommonName(value)),
  onOrganizationChange: value => dispatch(setHubCsrOrganization(value)),
  onOrganizationUnitChange: value => dispatch(setHubCsrOrganizationUnit(value)),
  onEmailChange: value => dispatch(setHubCsrEmail(value)),
  onLocalityChange: value => dispatch(setHubCsrLocality(value)),
  onCountryChange: value => dispatch(setHubCsrCountry(value)),
  onStateChange: value => dispatch(setHubCsrState(value)),
  onDnsChange: (index, value) => dispatch(changeHubCsrDns({ index, value })),
  onDnsAddClick: () => dispatch(addHubCsrDns()),
  onDnsRemoveClick: index => dispatch(removeHubCsrDns(index)),
  onIpChange: (index, value) => dispatch(changeHubCsrIp({ index, value })),
  onIpAddClick: () => dispatch(addHubCsrIp()),
  onIpRemoveClick: index => dispatch(removeHubCsrIp(index)),
  onSubmit: () => dispatch(submitHubCsr()),
});

const setDfspIcon = option => ({
  label: option.label,
  value: option.value,
  icon: option.hasCsrs ? 'check-small' : 'close-small',
});

const CSR = ({
  dfspsOptions,
  dfspId,
  certificate,
  csrType,
  csrTypeOptions,
  commonName,
  organization,
  organizationUnit,
  email,
  locality,
  country,
  state,
  validation,
  dnss,
  dnsValidation,
  ips,
  ipValidation,
  isModalVisible,
  isSubmitEnabled,
  isSubmitPending,
  onDfspChange,
  onCertificateChange,
  onCsrTypeChange,
  onViewClick,
  onModalCloseClick,
  onCommonNameChange,
  onOrganizationChange,
  onOrganizationUnitChange,
  onEmailChange,
  onLocalityChange,
  onStateChange,
  onCountryChange,
  onDnsChange,
  onDnsAddClick,
  onDnsRemoveClick,
  onIpChange,
  onIpAddClick,
  onIpRemoveClick,
  onSubmit,
}) => {
  return (
    <div className="hub__csr">
      <div>
        <Button
          className="hub__csr__submit"
          label="Submit"
          icon="check-small"
          onClick={onSubmit}
          pending={isSubmitPending}
          disabled={!isSubmitEnabled}
        />
      </div>
      <div className="hub__csr__dfsp">
        <FormInput
          type="select"
          label="Requested DFSP"
          onChange={onDfspChange}
          value={dfspId}
          options={dfspsOptions.map(setDfspIcon)}
          required
        />
      </div>
      <div className="hub__csr__csr-type">
        <FormInput
          type="radio"
          label="CSR Type"
          options={csrTypeOptions}
          onChange={onCsrTypeChange}
          value={csrType}
          required
        />
      </div>
      {csrType === CSR_TYPES.MANUAL ? (
        <div>
          <div className="hub__csr__csr-common-name">
            <FormInput
              type="text"
              label="Common Name"
              onChange={onCommonNameChange}
              value={commonName}
              validation={validation.fields.commonName}
            />
          </div>
          <div className="hub__csr__csr-organization">
            <FormInput
              type="text"
              label="Organization"
              onChange={onOrganizationChange}
              value={organization}
              validation={validation.fields.organization}
            />
          </div>
          <div className="hub__csr__csr-organization-unit">
            <FormInput
              type="text"
              label="Organization Unit"
              onChange={onOrganizationUnitChange}
              value={organizationUnit}
              validation={validation.fields.organizationUnit}
            />
          </div>
          <div className="hub__csr__csr-email">
            <FormInput
              type="text"
              label="Email"
              onChange={onEmailChange}
              value={email}
              validation={validation.fields.email}
            />
          </div>
          <div className="hub__csr__csr-locality">
            <FormInput
              type="text"
              label="Locality"
              onChange={onLocalityChange}
              value={locality}
              validation={validation.fields.locality}
            />
          </div>
          <div className="hub__csr__csr-country">
            <FormInput
              type="text"
              label="Country"
              onChange={onCountryChange}
              value={country}
              validation={validation.fields.country}
            />
          </div>
          <div className="hub__csr__csr-state">
            <FormInput
              type="text"
              label="State"
              onChange={onStateChange}
              value={state}
              validation={validation.fields.state}
            />
          </div>

          <div className="hub__csr__sections">Extensions</div>

          <div className="hub__csr__section">
            <div className="hub__csr__section-subtitle">DNS</div>
            <div className="hub__csr__dns__add">
              <Button label="Add DNS" icon="plus-small" noFill onClick={onDnsAddClick} />
            </div>
            {dnss.map((dns, index) => (
              <DNS
                key={index}
                index={index}
                value={dns}
                validation={dnsValidation[index]}
                onChange={value => onDnsChange(index, value)}
                onRemove={() => onDnsRemoveClick(index)}
              />
            ))}
          </div>

          <div className="hub__csr__section">
            <div className="hub__csr__section-subtitle">IPs</div>
            <div className="hub__csr__ip__add">
              <Button label="Add IP" icon="plus-small" noFill onClick={onIpAddClick} />
            </div>
            {ips.map((ip, index) => (
              <IP
                key={index}
                index={index}
                value={ip}
                validation={ipValidation[index]}
                onChange={value => onIpChange(index, value)}
                onRemove={() => onIpRemoveClick(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="hub__csr__csr-file">
          <FormInput
            type="file"
            label="CSR"
            parseFileAsText
            onChange={onCertificateChange}
            elementWidth="400px"
            value={certificate}
            required
          />
          {certificate && <FileControls onViewClick={onViewClick} />}
          {isModalVisible && <CertificateModal title="CSR" onClose={onModalCloseClick} content={certificate} />}
        </div>
      )}
    </div>
  );
};

const DNS = ({ index, value, validation, onChange, onRemove }) => (
  <div className="hub__csr__dns__row">
    <ControlIcon
      icon="close-small"
      className="hub__csr__dns__remove"
      size={20}
      tooltip={'Remove DNS'}
      kind="danger"
      onClick={onRemove}
    />
    <div className="hub__csr__dns__value">
      <FormInput type="text" placeholder="DNS" value={value} onChange={onChange} validation={validation} />
    </div>
  </div>
);

const IP = ({ index, value, validation, onChange, onRemove }) => (
  <div className="hub__csr__ip__row">
    <ControlIcon
      icon="close-small"
      className="hub__csr__ip__remove"
      size={20}
      tooltip={'Remove IP'}
      kind="danger"
      onClick={onRemove}
    />
    <div className="hub__csr__ip__value">
      <FormInput type="text" placeholder="IP" value={value} onChange={onChange} validation={validation} />
    </div>
  </div>
);

export default connect(
  stateProps,
  actionProps
)(CSR);
