import React from 'react';
import { composeClassName } from 'utils/html';
import { Icon, Tooltip } from '../index';
import './ControlIcon.css';

const ControlIcon = ({ icon, size, className, onClick, tooltip, tooltipPosition, kind, disabled }) => {
  const containerClassName = composeClassName([
    'control__icon__container',
    !disabled && onClick && 'control__icon__container--button',
    disabled && 'control__icon__container--disabled',
  ]);

  let iconComponent = (
    <div className={containerClassName} role="presentation" onClick={disabled ? undefined : onClick}>
      <Icon size={size} name={icon} />
    </div>
  );

  if (tooltip) {
    iconComponent = (
      <Tooltip label={tooltip} kind={kind} position={tooltipPosition} delay={300}>
        {iconComponent}
      </Tooltip>
    );
  }

  return <div className={composeClassName(['control__icon', className])}>{iconComponent}</div>;
};

export default ControlIcon;
