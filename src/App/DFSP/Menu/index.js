import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem, MenuSection } from 'components';
import { getMenuIcons } from './selectors';
import { getIsCurrentUserDfspUser } from 'Auth/selectors';

const stateProps = state => ({
  icons: getMenuIcons(state),
  isCurrentUserDfspUser: getIsCurrentUserDfspUser(state),
});

const MenuStructure = ({ pathname, onChange, icons, isCurrentUserDfspUser }) => {
  const { csrs } = icons;
  return (
    <Menu path="/dfsp" pathname={pathname} onChange={onChange}>
      <MenuSection label="General">
        <MenuItem path="/dfsp/hubEndpoints" label="Hub Endpoints" />
        <MenuItem path="/dfsp/endpoints" label="Endpoint Configuration" />
      </MenuSection>
      {isCurrentUserDfspUser && (
        <MenuSection label="Integration">
          <MenuItem path="/dfsp/pm4ml-credentials" label="PM4ML Credentials" />
        </MenuSection>
      )}
      <MenuSection label="Certificates">
        <MenuItem path="/dfsp/ca" label="Certificate Authorities" />
        <MenuItem path="/dfsp/tls/client" label="TLS Client Certificates" icon={csrs.icon} fill={csrs.fill} size={8} />
        <MenuItem path="/dfsp/tls/server" label="TLS Server Certificates" />
        <MenuItem path="/dfsp/jws" label="JWS Certificates" />
      </MenuSection>
    </Menu>
  );
};

const RouterMenu = ({ icons, isCurrentUserDfspUser, location, history }) => (
  <MenuStructure pathname={location.pathname} onChange={history.push} icons={icons} isCurrentUserDfspUser={isCurrentUserDfspUser} />
);
const ConnectedRouter = connect(stateProps, null)(RouterMenu);
export default withRouter(ConnectedRouter);
