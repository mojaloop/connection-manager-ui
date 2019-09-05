import React from 'react';
import { Icon } from '../index';
import { composeClassName } from '../../utils/html';
import './MessageBox.css';

const splitLines = (prev, curr) => [...prev, ...curr.split(`\n`)];

const getMessageComponent = (message, index) => (
  <div key={index} className="message-box__message">
    {message}
  </div>
);

const getMessages = message => {
  const subMessages = typeof message === 'string' ? [message] : message;
  return subMessages.reduce(splitLines, []).map(getMessageComponent);
};

const MessageBox = ({
  kind = 'default',
  icon,
  message,
  center,
  iconMargin,
  size = 20,
  fontSize = 13,
  className,
  children,
}) => {
  if (!message && !children) {
    return null;
  }

  const messageBoxClassName = composeClassName([
    'message-box',
    `message-box--${kind}`,
    center && 'message-box--centered',
    className,
  ]);
  const messagesClassName = composeClassName(['message-box__messages', center && 'message-box__messages--centered']);

  let iconComponent = null;
  if (icon) {
    iconComponent = (
      <div className="message-box__icon-box">
        <Icon className="message-box__icon" name={icon} size={size} />
      </div>
    );
  }

  return (
    <div className={messageBoxClassName}>
      {iconComponent}
      <div className={messagesClassName} style={{ fontSize: `${fontSize}px` }}>
        {children ? children : getMessages(message)}
      </div>
    </div>
  );
};

export default MessageBox;
