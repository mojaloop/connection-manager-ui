import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import { getIsAuthDisabled, getJwt, getSession, getExpiration, getLoggedUsername } from 'Auth/selectors';
import { logout, check } from 'Auth/actions';
import { getLoginUrl, checkSession } from 'App/selectors';

const stateProps = state => ({
  checkSession: checkSession(state),
  isAuthDisabled: getIsAuthDisabled(state),
  jwt: getJwt(state),
  session: getSession(state),
  expiration: getExpiration(state),
  loginUrl: getLoginUrl(state),
  username: getLoggedUsername(state),
});

const actionProps = dispatch => ({
  onLogoutClick: () => dispatch(logout()),
  check: () => dispatch(check()),
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
      this.check = props.check;
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
    async redirectIfUnauthenticated() {
      const { isAuthDisabled, jwt, loginUrl, session, checkSession } = this.props;
      if (isAuthDisabled) {
        return;
      }
      if (checkSession) {
        if (!session) this.check();
      } else if (!jwt) {
        window.location.assign(loginUrl);
        return;
      }
    }
    redirectIfExpired() {
      if (this.props.checkSession) return;
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
      if (!this.props.isAuthDisabled && !this.props.jwt && !this.props.session) {
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
