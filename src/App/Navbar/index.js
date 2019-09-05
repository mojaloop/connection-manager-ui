import React from 'react';
import { Icon, Tooltip } from 'components';
import './Navbar.css';

const Navbar = ({ username, onLogoutClick }) => (
  <div id="navbar">
    <div id="navbar__controls">
      <a id="navbar__link" href="/">
        Connection Manager
      </a>
    </div>
    <div id="navbar__user">
      <div id="navbar__user__icon">
        <Icon name="user-small" fill="#fff" />
      </div>
      <div id="navbar__user__name" onClick={onLogoutClick}>
        <Tooltip label="logout">{username || '-'}</Tooltip>
      </div>
    </div>
  </div>
);

export default Navbar;
