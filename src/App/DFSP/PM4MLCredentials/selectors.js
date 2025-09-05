import { createSelector } from 'reselect';

export const getDfspPM4MLCredentialsState = state => state.dfsp.pm4mlCredentials;

export const getDoCredentialsExist = createSelector(
  getDfspPM4MLCredentialsState,
  state => state.credentialsExist
);

export const getIsDfspCredentialsPending = createSelector(
  getDfspPM4MLCredentialsState,
  state => state.isPending
);

export const getDfspCredentialsError = createSelector(
  getDfspPM4MLCredentialsState,
  state => state.error
);

export const getCredentialsLoadingStatus = createSelector(
  getDoCredentialsExist,
  getIsDfspCredentialsPending,
  getDfspCredentialsError,
  (credentialsExist, isPending, error) => ({
    credentialsExist,
    isPending,
    hasError: !!error,
    error,
    canGenerate: !isPending,
    canReveal: credentialsExist && !isPending,
  })
); 