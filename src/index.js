import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter, push } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { sleep } from 'utils/async';
import { isDevelopment } from 'utils/env';
import configureStore from 'utils/store';
import getConfig from 'utils/getConfig';
import { setAppConfig, initApp } from 'App/actions';
import { setAuthEnabled, setAuthDisabled } from 'Auth/actions';
import App from 'App/index.js';
import Auth from 'Auth/index.js';
import PasswordChange from 'Auth/PasswordChange';
import TOTP from 'Auth/TOTP';
import 'icons/index';
import 'assets/normalize.css';
import 'index.css';

// setup browser history for client side routing
const history = createBrowserHistory({
  basename: '/',
});

const NotFound = () => <div> View Not Found </div>;

const Root = ({ store }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/login" exact component={Auth} />
        <Route path="/login/2fa" component={TOTP} />
        <Route path="/login/passwordChange" component={PasswordChange} />
        <Route path="/" component={App} />
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default Root;

const boot = async () => {
  const { isAuthEnabled, apiBaseUrl, checkSession, loginProvider, loginUrl = `${window.location.protocol}//${window.location.host}/login`, logoutUrl} = await getConfig();
  const apiUrl = `${apiBaseUrl}/api`;

  const store = configureStore(history, { isDevelopment, isAuthEnabled });

  store.dispatch(setAppConfig({ apiUrl, loginProvider, loginUrl, logoutUrl, checkSession }));

  ReactDOM.render(<Root store={store} />, document.getElementById('root'));

  if (isDevelopment) {
    const fetch = window.fetch;
    window.fetch = async (...args) => {
      await sleep(200);
      return fetch(...args);
    };
    // assing to global so that we can easily retrieve state
    // and dispatch actions from the browser console
    global.dispatch = store.dispatch;
    global.getState = store.getState;

    // Allow to disable auth when developing
    global.auth = async (enable = false) => {
      if (enable) {
        store.dispatch(setAuthEnabled());
      } else {
        store.dispatch(setAuthDisabled());
      }
      store.dispatch(push('/'));
      await store.dispatch(initApp());
    };
  }

  global.version = () => {
    // Prints the TSP version and Commit Hash
    console.info(`TSP v${process.env.REACT_APP_VERSION}`);
    console.info(`Commit # ${process.env.REACT_APP_COMMIT}`);
  };
};

boot();
