import { createSelector } from 'reselect';

const getRotateJWSCerts = (state) => {
  return state.hub.jws.rotate;
};

export const getRotateJWSCertsPending = createSelector(
  getRotateJWSCerts,
  (rotate) => rotate.rotateJWSCertsPending
);
