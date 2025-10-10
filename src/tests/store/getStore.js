import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import fetchMiddleware from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-fetch';
import history from '../dummy/history';
import reducer from 'reducers';

const historyMock = new history();

const ReduxRouter = routerMiddleware(historyMock);
const ReduxFetch = fetchMiddleware();

const getStore = (initialState = undefined) => {
  const defaultState = initialState ? {
    ...initialState,
    app: {
      config: {
        apiUrl: 'http://localhost:3001',
        ...initialState?.app?.config
      },
      ...initialState?.app
    }
  } : undefined;
  const middlewares = applyMiddleware(ReduxThunk, ReduxFetch, ReduxRouter);
  return createStore(reducer(historyMock), defaultState, middlewares);
};

export default getStore;
export { historyMock };
