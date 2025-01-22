import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem, MenuSection } from 'components';
import { getMenuIcons } from './selectors';

const stateProps = state => ({
  icons: getMenuIcons(state),
});

const MenuStructure = ({ companyId, pathname, icons, onChange }) => {
  const { unprocessed, csrs, ca } = icons;
  return (
    <Menu path="/hub" pathname={pathname} onChange={onChange}>
      <MenuSection label="General">
        <MenuItem path="/hub/endpoints" label="Endpoint Configuration" />
        <MenuItem
          path="/hub/unprocessed"
          label="Unprocessed Endpoints"
          icon={unprocessed.icon}
          fill={unprocessed.fill}
          size={8}
        />
      </MenuSection>
      <MenuSection label="Certificates">
        <MenuItem path="/hub/ca" label="Certificate Authorities" icon={ca.icon} fill={ca.fill} size={8} />
        <MenuItem path="/hub/tls/client" label="TLS Client Certificates" icon={csrs.icon} fill={csrs.fill} size={8} />
        <MenuItem path="/hub/tls/server" label="TLS Server Certificates" />
      </MenuSection>
      <MenuSection label="Administration">
        <MenuItem path="/hub/dfsps" label="DFSPs" />
      </MenuSection>
    </Menu>
  );
};

const RouterMenu = ({ icons, location, history }) => (
  <MenuStructure pathname={location.pathname} onChange={history.push} icons={icons} />
);
const ConnectedRouter = connect(stateProps, null)(RouterMenu);
export default withRouter(ConnectedRouter);
