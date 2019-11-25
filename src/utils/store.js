import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import ReduxThunk from 'redux-thunk';
import fetchMiddleware from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import reducers from '../reducers';

export default function configureStore(history, config) {
  const { isDevelopment, isAuthEnabled } = config;
  const ReduxRouter = routerMiddleware(history);
  const ReduxFetch = fetchMiddleware();

  const middlewareList = [ReduxThunk, ReduxRouter, ReduxFetch];
  let composers = [];

  if (isDevelopment) {
    // add devTool composer
    const devToolsComposer = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
    composers.push(devToolsComposer);
  }

  composers.unshift(applyMiddleware(...middlewareList));
  const middlewares = compose(...composers);

  return createStore(reducers(history, isAuthEnabled), undefined, middlewares);
}
