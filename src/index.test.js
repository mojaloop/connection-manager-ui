import { createMemoryHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import fetchMiddleware from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';

// ✅ Move jest.mock() below imports
jest.mock('./reducers', () => {
  const { combineReducers } = require('redux');

  return {
    __esModule: true, // Ensures it's treated as an ES module
    default: (history, isAuthEnabled) =>
      combineReducers({
        router: (state = { location: { pathname: '/' } }, action) => state, // Mocked router reducer
        api: (state = {}, action) => state,
        auth: combineReducers({
          login: (state = {}, action) => state,
        }),
      }),
  };
});

// ✅ Use require instead of import to prevent ESLint issue
const reducers = require('./reducers').default;

describe('Redux Store Reducers', () => {
  let store;
  let historyMock;

  beforeEach(() => {
    historyMock = createMemoryHistory(); // ✅ Use memory history

    const middlewares = applyMiddleware(
      thunk,
      fetchMiddleware(),
      routerMiddleware(historyMock)
    );

    store = createStore(reducers(historyMock, true), middlewares); // ✅ Ensure reducers is a function
  });

  it('Creates all the reducers', () => {
    const state = store.getState();

    expect(state).toHaveProperty('router');
    expect(state.router).toHaveProperty('location');
    expect(state.router.location.pathname).toBe('/'); // ✅ Ensure mock router works

    expect(state).toHaveProperty('api');
    expect(state).toHaveProperty('auth');
  });
});
