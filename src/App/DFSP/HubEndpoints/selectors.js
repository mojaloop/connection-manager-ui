import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { createPendingSelector } from '@modusbox/modusbox-ui-components/dist/redux-fetch';
import * as testers from 'utils/testers';
import { DIRECTIONS, TYPES } from '../constants';

export const getDfspHubEndpointsEndpoints = state => state.dfsp.endpoints.hub.dfspHubEndpoints;
export const getDfspHubEndpointsEndpointsError = state => state.dfsp.endpoints.hub.dfspHubEndpointsError;

export const getDfspHubEndpointsPerDirection = createSelector(getDfspHubEndpointsEndpoints, (endpoints, dfsps) => {
  const hasDirection = direction => endpoint => endpoint.direction === direction;
  const egress = endpoints.filter(hasDirection(DIRECTIONS.EGRESS));
  const ingressEndpoints = endpoints.filter(hasDirection(DIRECTIONS.INGRESS));
  const ingress = sortBy(ingressEndpoints, { type: TYPES.IP });
  return {
    egress,
    ingress,
  };
});

const getIsendpointsReadPending = createPendingSelector('hubEndpoints.read');

export const getIsDfspHubEndpointsLoading = createSelector(getIsendpointsReadPending, testers.getAnyIs(true));
