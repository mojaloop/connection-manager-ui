import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import { getIsAuthDisabled, getJwt, getExpiration, getLoggedUsername } from 'Auth/selectors';
import { logout } from 'Auth/actions';
import { getLoginUrl } from 'App/selectors';

const stateProps = state => ({
  isAuthDisabled: getIsAuthDisabled(state),
  jwt: getJwt(state),
  expiration: getExpiration(state),
  loginUrl: getLoginUrl(state),
  username: getLoggedUsername(state),
});

const actionProps = dispatch => ({
  onLogoutClick: () => dispatch(logout()),
});

function withAuth(Component, fnName) {
  class authHoc extends PureComponent {
    static isExpired(ts) {
      return new Date().getTime() > ts;
    }

    constructor(props) {
      super(props);

      this.redirectIfUnauthenticated = this.redirectIfUnauthenticated.bind(this);
      this.redirectIfExpired = this.redirectIfExpired.bind(this);
    }

    componentWillMount() {
      this.redirectIfUnauthenticated();
      this.redirectIfExpired();
    }
    componentDidMount() {
      if (!this.props.isAuthDisabled) {
        this.interval = setInterval(this.redirectIfExpired, 60000);
      }
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    componentDidUpdate(prevProps) {
      const isJwtChanged = prevProps.jwt !== this.props.jwt;
      const isAuthChanged = prevProps.isAuthDisabled !== this.props.isAuthDisabled;
      const isExpirationChanged = prevProps.expiration !== this.props.expiration;

      if (isJwtChanged || isAuthChanged || isExpirationChanged) {
        this.redirectIfUnauthenticated();
        this.redirectIfExpired();
      }
    }
    redirectIfUnauthenticated() {
      const { isAuthDisabled, jwt, loginUrl } = this.props;
      if (isAuthDisabled) {
        return;
      }
      if (!jwt) {
        window.location.assign(loginUrl);
        return;
      }
    }
    redirectIfExpired() {
      const { isAuthDisabled, expiration, loginUrl } = this.props;
      if (isAuthDisabled) {
        return;
      }
      if (authHoc.isExpired(expiration)) {
        window.location.assign(loginUrl);
        return;
      }
    }
    render() {
      if (!this.props.isAuthDisabled && !this.props.jwt) {
        return <Spinner center size="m" />;
      }
      return <Component {...this.props} />;
    }
  }

  return connect(
    stateProps,
    actionProps
  )(authHoc);
}
export { withAuth };
