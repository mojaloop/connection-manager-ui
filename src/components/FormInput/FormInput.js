import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Select, TextField, Checkbox, DatePicker, FileUploader, RadioGroup, Row, Button, Icon } from '../index';
import './FormInput.scss';

const Label = ({ label, required, complete }) => {
  if (!label) {
    return null;
  }
  return (
    <div className="forminput__label-box">
      {required && (
        <Icon
          size={14}
          name="info-small"
          className="forminput__label-icon"
          fill={complete ? '#39f' : '#f93'}
          tooltip={complete ? '' : 'This is a required field'}
        />
      )}
      <label>{label}</label>
    </div>
  );
};

const InlineButton = ({ visible, isLocked, isDisabled, onClick, label }) => {
  if (!visible || isLocked || isDisabled) {
    return null;
  }

  return (
    <Button
      size="m"
      noFill
      kind="secondary"
      className="forminput__inline-button"
      onClick={onClick}
      disabled={isDisabled}
      label={label}
    />
  );
};

const LockedIcon = ({ locked }) => {
  if (!locked) {
    return null;
  }
  return <Icon name="lock-small" size={20} fill="#999" style={{ marginLeft: '10px' }} />;
};

const addKey = (element, index) => React.cloneElement(element, { key: index });

const composeSelect = props => [
  <div className="forminput-input" style={props.wrapperStyle}>
    <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
    <Select
      size={props.size}
      className={props.className}
      id={props.componentId}
      selected={props.value}
      options={props.options}
      onChange={props.onChange}
      required={props.isRequiredAndUnset}
      invalid={props.isInvalid}
      disabled={props.isDisabled}
      style={props.inputStyle}
      placeholder={props.placeholder}
      pending={props.isPending}
    />
    {props.children !== undefined && props.children}
  </div>,
  <InlineButton
    visible={props.hasInlineButton}
    locked={props.isLocked}
    disabled={props.isDisabled}
    onClick={props.onInlineButtonClick}
    label={props.inlineButtonLabel}
  />,
  <LockedIcon locked={props.isLocked} />,
];

const composePicker = props => [
  <div className="forminput-input picker" style={props.wrapperStyle}>
    <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
    <TextField
      type="text"
      size={props.size}
      className={props.className}
      icon="search"
      id={props.componentId}
      onKeyDown={props.onKeyDown}
      onClick={props.onClick}
      value={props.value}
      pending={props.isPending}
      disabled={props.isDisabled}
      required={props.isRequiredAndUnset}
      invalid={props.isInvalid}
      invalidMessages={props.validationMessages}
      style={props.inputStyle}
      placeholder={props.placeholder}
      buttonText={props.inlineButtonLabel}
      buttonKind="secondary"
      buttonDisabled={!props.hasValue}
      onButtonClick={props.onInlineButtonClick}
    />
    {props.children !== undefined && props.children}
  </div>,
  <LockedIcon locked={props.isLocked} />,
];

const composeText = props => [
  <div className="forminput-input" style={props.wrapperStyle}>
    <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
    <TextField
      type={props.type}
      className={props.className}
      size={props.size}
      id={props.componentId}
      icon={props.icon}
      autofocus={props.autofocus}
      value={props.value}
      onChange={props.onChange}
      disabled={props.isDisabled}
      required={props.isRequiredAndUnset}
      pending={props.isPending}
      invalid={props.isInvalid}
      invalidMessages={props.validationMessages}
      style={props.inputStyle}
      placeholder={props.placeholder}
    />
    {props.children !== undefined && props.children}
  </div>,
  <InlineButton
    visible={props.hasInlineButton}
    locked={props.isLocked}
    disabled={props.isDisabled}
    onClick={props.onInlineButtonClick}
    label={props.inlineButtonLabel}
  />,
  <LockedIcon locked={props.isLocked} />,
];

const composeDate = props => [
  <div className="forminput-input" style={props.wrapperStyle}>
    <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
    <DatePicker
      size={props.size}
      className={props.className}
      withTime={props.type === 'datetime'}
      format={props.format || 'X'} // export as seconds timestamp
      exportFormat={props.exportFormat || 'X'}
      onSelect={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
      required={props.isRequiredAndUnset}
      invalid={props.isInvalid}
      invalidMessages={props.validationMessages}
      pending={props.isPending}
      disabled={props.isDisabled}
      style={props.inputStyle}
      id={props.componentId}
      label={props.label}
      hasTime
    />
    {props.children !== undefined && props.children}
  </div>,
  <InlineButton
    visible={props.hasInlineButton}
    locked={props.isLocked}
    disabled={props.isDisabled}
    onClick={props.onInlineButtonClick}
    label={props.inlineButtonLabel}
  />,
  <LockedIcon locked={props.isLocked} />,
];

const composeFile = props => {
  let parseFileAs;
  if (props.parseFileAsText) {
    parseFileAs = 'text';
  } else if (props.parseFileAsBase64) {
    parseFileAs = 'base64';
  }
  return [
    <div className="forminput-input" style={props.wrapperStyle}>
      <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
      <FileUploader
        size={props.size}
        className={props.className}
        style={props.inputStyle}
        id={props.componentId}
        placeholder={props.placeholder}
        file={props.value}
        fileName={props.fileName}
        fileType={props.fileType}
        parseFileAs={parseFileAs}
        pending={props.isPending}
        onChange={props.onChange}
        required={props.isRequiredAndUnset}
        invalid={props.isInvalid}
        invalidMessages={props.validationMessages}
        disabled={props.isDisabled}
      />
      {props.children !== undefined && props.children}
    </div>,
    <InlineButton
      visible={props.hasInlineButton}
      locked={props.isLocked}
      disabled={props.isDisabled}
      onClick={props.onInlineButtonClick}
      label={props.inlineButtonLabel}
    />,
    <LockedIcon locked={props.isLocked} />,
  ];
};

const composeRadio = props => [
  <div className="forminput-checkbox" style={props.wrapperStyle}>
    <Label label={props.label} required={props.isRequired} complete={props.hasValue} />
    <RadioGroup
      id={props.componentId}
      onChange={props.onChange}
      disabled={props.isDisabled}
      value={props.value}
      options={props.options}
    />
  </div>,
  <LockedIcon locked={props.isLocked} />,
];

const composeCheckbox = props => [
  <div className="forminput-checkbox" style={props.wrapperStyle}>
    <Checkbox
      id={props.componentId}
      label={props.label}
      checked={props.value}
      onChange={props.onChange}
      disabled={props.isDisabled}
    />
  </div>,
  <LockedIcon locked={props.isLocked} />,
];

class FormInput extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
    this.onTextFieldKeyDown = this.onTextFieldKeyDown.bind(this);

    this.state = {
      value: undefined,
      isRequired: undefined,
      isPending: undefined,
      isInvalid: undefined,
    };
  }
  onChange(value) {
    const { transformUpdate, onChange } = this.props;
    let updateValue = value;
    if (typeof transformUpdate === 'function') {
      updateValue = transformUpdate(value);
    }
    if (typeof onChange === 'function') {
      onChange(updateValue);
    }
  }
  onTextFieldChange(value) {
    let updateValue = value;
    if (value === '') {
      updateValue = undefined;
    }
    this.onChange(updateValue);
  }
  onTextFieldKeyDown(e) {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    if (typeof onClick === 'function') {
      this.props.onClick();
    }
  }
  render() {
    const {
      validation,
      transformValue,
      required,
      invalid,
      pending,
      messageVisibility,
      errorVisibility,
      message,
      type,
      style,
      className,
      size,
      name,
      label,
      // optional parameters
      subgroup,
      hidden,
      icon,
      autofocus,
      disabled,
      locked,
      elementWidth,
      rowWidth = '100%',
      placeholder = '',
      id,
      // select and radio parameters
      options,
      // used by the textfield to do some external action
      onClick,
      // extra inline button
      onInlineButtonClick,
      inlineButtonLabel,
      // Date Picker Props
      format,
      exportFormat,
      // FileUploader Props
      parseFileAsText,
      parseFileAsBase64,
      fileType,
      fileName,
      // has children to be shown below
      children,
    } = this.props;

    if (hidden === true) {
      return null;
    }

    let value = this.props.value;

    if (typeof transformValue === 'function') {
      value = transformValue(value);
    }

    const hasValue = value !== undefined && value !== null && value !== '';
    const hasValidationMessages = validation && validation.messages && validation.messages.length > 0;
    const isFieldInvalid = validation && validation.isValid === false && hasValue;
    const hasValidationRequiredFlag = validation && validation.isRequired;
    const isRequired = required || hasValidationRequiredFlag;
    const shouldShowValidation = invalid || isFieldInvalid || messageVisibility === true;
    const isInvalid = shouldShowValidation && errorVisibility !== false;
    const isPending = pending;
    const validationMessages = hasValidationMessages ? validation.messages : [];
    // Validate the extra message that appears below input, external to value validation
    const messageVisibilities = Array.isArray(messageVisibility) ? messageVisibility : [messageVisibility];
    const messages = Array.isArray(message) ? message : [message];
    const activeMessageIndex = messageVisibilities.indexOf(true);
    const inputMessage = activeMessageIndex === -1 ? null : messages[activeMessageIndex];
    if (inputMessage !== null) {
      validationMessages.push({ message: inputMessage, active: false });
    }

    const wrapperStyle = { width: elementWidth, ...style };
    const inputStyle = { width: elementWidth };

    const isRequiredAndUnset = isRequired && !hasValue;

    const commonProps = {
      componentId: id || (subgroup ? `${subgroup}-${name}` : name),
      isDisabled: disabled === true || isPending === true,
      label,
      placeholder,
      className,
      size,
      value,
      isRequired,
      isRequiredAndUnset,
      isPending,
      isInvalid,
      validationMessages,
      wrapperStyle,
      inputStyle,
      isLocked: locked,
      hasValue,
      onChange: this.onChange,
      children,
    };

    const buttonProps = {
      hasInlineButton: typeof onInlineButtonClick === 'function',
      inlineButtonLabel,
      onInlineButtonClick,
    };

    // Return correct input
    let switchInput = null;

    if (type === 'select') {
      switchInput = composeSelect({ ...commonProps, ...buttonProps, options });
    } else if (type === 'checkbox') {
      switchInput = composeCheckbox({ ...commonProps });
    } else if (type === 'radio') {
      switchInput = composeRadio({ ...commonProps, options });
    } else if (type === 'picker') {
      switchInput = composePicker({ ...commonProps, ...buttonProps, onClick, onKeyDown: this.onTextFieldKeyDown });
    } else if (type === 'date' || type === 'datetime') {
      switchInput = composeDate({ ...commonProps, ...buttonProps, type, format, exportFormat });
    } else if (type === 'file') {
      switchInput = composeFile({ ...commonProps, parseFileAsText, parseFileAsBase64, fileType, fileName });
    } else if (type === 'text' || type === 'number' || type === 'email' || type === 'password') {
      switchInput = composeText({
        ...commonProps,
        ...buttonProps,
        type,
        icon,
        autofocus,
        onChange: this.onTextFieldChange,
      });
    }
    switchInput = switchInput.map(addKey);

    return (
      <Row align="left center" style={{ width: rowWidth }}>
        {switchInput}
      </Row>
    );
  }
}

FormInput.propTypes = {
  type: PropTypes.oneOf([
    'select',
    'checkbox',
    'radio',
    'text',
    'number',
    'email',
    'password',
    'picker',
    'date',
    'datetime',
    'file',
  ]),
  name: PropTypes.string,
  label: PropTypes.string,
  update: PropTypes.func,
  validation: PropTypes.shape({
    isRequired: PropTypes.bool,
    isValid: PropTypes.bool,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string,
        active: PropTypes.bool,
      })
    ),
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  transformValue: PropTypes.func,
  transformUpdate: PropTypes.func,
  // eslint-disable-next-line
  allowEmpty: PropTypes.bool,

  // overwrite a nested object in the store
  subgroup: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  changeBase: PropTypes.bool,
  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  // eslint-disable-next-line
  error: PropTypes.bool,
  pending: PropTypes.bool,
  icon: PropTypes.string,
  // eslint-disable-next-line
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  messageVisibility: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.bool)]),
  errorVisibility: PropTypes.bool,
  // eslint-disable-next-line
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  onClick: PropTypes.func,
  onInlineButtonClick: PropTypes.func,
  inlineButtonLabel: PropTypes.string,
  autofocus: PropTypes.bool,
  // eslint-disable-next-line
  debug: PropTypes.bool,

  //   custom for date picker
  format: PropTypes.string,
  exportFormat: PropTypes.string,

  // custom for fileuploader
  parseFileAsText: PropTypes.bool,
  fileName: PropTypes.string,
  fileType: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape(),
  elementWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  locked: PropTypes.bool,
};

FormInput.defaultProps = {
  name: undefined,
  label: undefined,
  update: undefined,
  validation: undefined,
  value: undefined,
  options: undefined,
  transformValue: undefined,
  transformUpdate: undefined,
  allowEmpty: false,
  subgroup: undefined,
  changeBase: undefined,
  locked: false,
  hidden: false,
  autofocus: false,
  disabled: false,
  required: undefined,
  error: undefined,
  pending: undefined,
  icon: undefined,
  messageVisibility: undefined,
  errorVisibility: undefined,
  message: undefined,
  onClick: undefined,
  onInlineButtonClick: undefined,
  inlineButtonLabel: 'Custom',
  debug: undefined,
  format: undefined,
  exportFormat: undefined,
  parseFileAsText: undefined,
  fileName: undefined,
  fileType: undefined,
  type: 'text',
  className: undefined,
  style: undefined,
  elementWidth: undefined,
  rowWidth: '100%',
};
export default FormInput;
