import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import fetchMiddleware from 'modusbox-ui-components/dist/redux-fetch';
import history from '../dummy/history';
import reducer from 'reducers';

const historyMock = new history();

const ReduxRouter = routerMiddleware(historyMock);
const ReduxFetch = fetchMiddleware();

const getStore = (initialState = undefined) => {
  const middlewares = applyMiddleware(ReduxThunk, ReduxFetch, ReduxRouter);
  return createStore(reducer(historyMock), initialState, middlewares);
};

export default getStore;
export { historyMock };
