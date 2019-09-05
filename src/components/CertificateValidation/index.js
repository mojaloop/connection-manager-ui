import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Button, Icon, Modal } from '../index.js';
import { composeClassName } from 'utils/html';
import './index.scss';

const VALID = 'VALID';
const INVALID = 'INVALID';
const NOT_AVAILABLE = 'NOT_AVAILABLE';
const STATES = { VALID, INVALID, NOT_AVAILABLE };

const getTypeLabelByType = type => {
  if (type === 'csr') {
    return { prefix: 'This', label: 'CSR', verb: 'is', haveVerb: 'has' };
  } else if (type === 'certificate') {
    return { prefix: 'This', label: 'Certificate', verb: 'is', haveVerb: 'has' };
  } else if (type === 'both') {
    return { prefix: 'These', label: 'CSR and Certificate', verb: 'are', haveVerb: 'have' };
  } else if (type === 'ca') {
    return { prefix: 'This', label: 'Certificate Authority', verb: 'is', haveVerb: 'has' };
  }
  return null;
};
const getIconByState = state => {
  if (state === INVALID) {
    return 'warning-sign';
  } else if (state === VALID) {
    return 'check-small';
  }
  return 'question-mark';
};

const getMessageByStateAndType = (state, type) => {
  const { prefix, label, verb } = getTypeLabelByType(type);
  if (state === INVALID) {
    return `${prefix} ${label} ${verb} invalid.`;
  } else if (state === VALID) {
    return `${prefix} ${label} ${verb} valid.`;
  }
  return `The ${label} validity is unknown.`;
};

const getModalTitleByStateAndType = (state, type) => {
  const { label } = getTypeLabelByType(type);
  if (state === INVALID) {
    return `Invalid ${label}`;
  } else if (state === VALID) {
    return `Valid ${label}`;
  }
  return undefined;
};

const getModalKindByState = state => {
  if (state === INVALID) {
    return 'danger';
  } else if (state === VALID) {
    return 'primary';
  }
  return undefined;
};

const getButtonKindByState = state => {
  if (state === INVALID) {
    return 'danger';
  } else if (state === VALID) {
    return 'success';
  }
  return undefined;
};

const removeNotPerformed = validation => validation.performed === true;
const hasCodeStartingWith = strs => validation => strs.some(str => validation.validationCode.startsWith(str));
const isCertificate = hasCodeStartingWith(['CERTIFICATE_', 'CSR_CERT_']);
const isCA = hasCodeStartingWith(['VERIFY_ROOT_', 'CA_CERTIFICATE_', 'VERIFY_CHAIN_']);
const isInvalid = validation => validation.result === STATES.INVALID;

const getRealType = (validations = []) => {
  const hasSomeCACodes = validations.some(isCA);
  const hasSomeCertificatesCodes = validations.some(isCertificate);
  const hasSomeInvalidCSRsCodes = validations.some(
    validation => !isCertificate(validation) && !isCA(validation) && isInvalid(validation)
  );
  const hasSomeInvalidCertificatesCodes = validations.some(
    validation => isCertificate(validation) && isInvalid(validation)
  );

  if (hasSomeCACodes) {
    return 'ca';
  } else if (hasSomeInvalidCSRsCodes && hasSomeInvalidCertificatesCodes) {
    return 'both';
  } else if (hasSomeInvalidCertificatesCodes) {
    return 'certificate';
  } else if (hasSomeInvalidCSRsCodes) {
    return 'csr';
  } else if (hasSomeCertificatesCodes) {
    return 'certificate';
  }
  return 'csr';
};

class CertificateValidation extends PureComponent {
  static getDerivedStateFromProps(props) {
    // make sure the certificate validation state prop is set to one of the available
    // otherwise default to NOT_AVAILABLE in order to properly display missing or invalid data
    const validations = props.validations.filter(removeNotPerformed);
    return {
      state: STATES.hasOwnProperty(props.state) ? props.state : NOT_AVAILABLE,
      validations,
      type: props.type || getRealType(validations),
    };
  }
  constructor(props) {
    super(props);
    this.onViewDetailsClick = this.onViewDetailsClick.bind(this);
    this.onCloseModalClick = this.onCloseModalClick.bind(this);
    this.state = {
      isModalVisible: false,
    };
  }
  onViewDetailsClick() {
    this.setState({
      isModalVisible: true,
    });
  }
  onCloseModalClick() {
    this.setState({
      isModalVisible: false,
    });
  }
  render() {
    const { state, validations, type } = this.state;
    const validationClassName = composeClassName([
      'certificate-validation',
      state === VALID && 'certificate-validation--valid',
      state === INVALID && 'certificate-validation--invalid',
      state === NOT_AVAILABLE && 'certificate-validation--unavailable',
    ]);

    const icon = getIconByState(state);
    const message = getMessageByStateAndType(state, type);
    const buttonKind = getButtonKindByState(state);

    return (
      <div className={validationClassName}>
        <div className="certificate-validation__row">
          <Icon size={20} className="certificate-validation__icon" name={icon} />
          <div className="certificate-validation__message">{message}</div>
          {state !== NOT_AVAILABLE && (
            <Button size="s" label="View Details" kind={buttonKind} onClick={this.onViewDetailsClick} />
          )}
        </div>
        {this.state.isModalVisible && (
          <CertificateValidationModal
            type={type}
            state={state}
            validations={validations}
            onClose={this.onCloseModalClick}
          />
        )}
      </div>
    );
  }
}

CertificateValidation.propTypes = {
  type: PropTypes.oneOf(['ca', 'csr', 'certificate']),
  state: PropTypes.string,
  validations: PropTypes.arrayOf(PropTypes.shape()),
};
CertificateValidation.defaultProps = {
  kind: undefined,
  state: NOT_AVAILABLE,
  validations: [],
};

const CertificateValidationModal = ({ type, state, validations, onClose }) => {
  const title = getModalTitleByStateAndType(state, type);
  const kind = getModalKindByState(state);

  return (
    <Modal
      title={title}
      allowClose={false}
      allowSubmit
      isSubmitEnabled
      onSubmit={onClose}
      primaryAction="Continue"
      width="800px"
      kind={kind}
    >
      <ModalTitle state={state} type={type} />
      <div>{validations.map(toValidationRow)}</div>
    </Modal>
  );
};

const ModalTitle = ({ state, type }) => {
  const modalTitleClassName = composeClassName([
    'certificate-validation__modal__title',
    state === VALID && 'certificate-validation__modal__title--valid',
    state === INVALID && 'certificate-validation__modal__title--invalid',
  ]);
  const { label, haveVerb } = getTypeLabelByType(type);

  return (
    <div className={modalTitleClassName}>
      <Icon name={getIconByState(state)} size={30} />
      <span className="certificate-validation__modal__title-text">
        The {label} {haveVerb} the following validations
      </span>
    </div>
  );
};

const toValidationRow = (validation, index) => {
  const isValid = validation.result === VALID;
  const validationItemClassName = composeClassName([
    'certificate-validation__modal__item',
    isValid && 'certificate-validation__modal__item--valid',
    !isValid && 'certificate-validation__modal__item--invalid',
  ]);
  const icon = isValid ? 'check-small' : 'close-small';
  const message = parseValidation(validation);
  return (
    <div key={index} className={validationItemClassName}>
      <Icon size={26} className="certificate-validation__modal__item-icon" name={icon} />
      <div className="certificate-validation__modal__item-message">{message}</div>
    </div>
  );
};

const parseValidation = validation => {
  const { message, messageTemplate, data } = validation;
  if (messageTemplate === '') {
    return message;
  }
  // find all the template literals
  const regex = /\${data\.([a-zA-Z.]+)}/g;
  const results = messageTemplate.match(regex);

  const replacements = results.map(result => {
    // extract the key from the literal ${data._KEY_}
    const [, key] = result.match(/(\w+)/g);
    const { type, value } = data[key];
    if (type === 'DATE') {
      return moment(value)
        .tz(moment.tz.guess())
        .format('lll z');
    }
    return value;
  });
  return messageTemplate.replace(regex, match => {
    return replacements.pop();
  });
};
export default CertificateValidation;
