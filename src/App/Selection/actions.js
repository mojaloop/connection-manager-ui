import { push } from 'connected-react-router';
import { setDfspId } from 'App/actions';

export const selectHub = () => dispatch => dispatch(push('/hub'));

export const selectDFSP = dfspId => dispatch => {
  dispatch(setDfspId(dfspId));
  dispatch(push('/dfsp'));
};
