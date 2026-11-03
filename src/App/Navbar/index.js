import React, { useEffect, useRef, useState } from 'react';
import { Icon } from 'components';
import './Navbar.css';

const Navbar = ({ username, onLogoutClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }
    const onDocumentMouseDown = e => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const onDocumentKeyDown = e => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div id="navbar">
      <div id="navbar__controls">
        <a id="navbar__link" href="/">
          Connection Manager
        </a>
      </div>
      <div id="navbar__user" ref={userRef}>
        <button
          type="button"
          id="navbar__user__button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div id="navbar__user__icon">
            <Icon name="user-small" fill="#fff" />
          </div>
          <div id="navbar__user__name">{username || '-'}</div>
          <span id="navbar__user__caret" aria-hidden="true" />
        </button>
        {isMenuOpen && (
          <div id="navbar__user__menu" role="menu">
            <button type="button" id="navbar__user__menu__logout" role="menuitem" onClick={onLogoutClick}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
