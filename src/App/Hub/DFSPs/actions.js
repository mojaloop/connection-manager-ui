import api from 'utils/api';
import { is200 } from 'utils/http';
import { showSuccessToast, showErrorModal } from 'App/actions';

export const onboardDFSP = dfspId => async dispatch => {
  const { data, status } = await dispatch(api.onboard.create({ dfspId }));
  if (is200(status)) {
    dispatch(showSuccessToast());
  } else {
    dispatch(showErrorModal({ status, data }));
  }
};
