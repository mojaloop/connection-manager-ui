import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fetchMock, MATCHED } from 'fetch-mock';
import { getStore } from 'tests/store';
import { setAppConfig, setDfspId } from 'App/actions';
import { AppSelection } from 'App/Selection';
import { setAuthEnabled, storeHoldings } from './actions';
import { getHoldingsError, getIsHubOperator, getMaySeeDfsps, getMayManageCredentials } from './selectors';
import { ALL, HOLDINGS_MESSAGES } from './constants';

const SESSION_URL = 'http://auth.test/sessions/whoami';
const SERVICE = 'mcmApi';
const LISTING = `${SERVICE}.getDFSPs`;
const CREDENTIALS = `${SERVICE}.getCredentials`;
const DFSP = 'dfsp1';
const OTHER_DFSP = 'dfsp2';
const RESOURCE_NAME = 'participant';

const held = (permission, scope) => ({ [permission]: { [RESOURCE_NAME]: scope } });

let dispatch;
let getState;

const configure = (config = { checkSession: SESSION_URL, apiService: SERVICE }) =>
  dispatch(setAppConfig({ apiUrl: 'http://localhost:3001', ...config }));

const session = (...permissions) => ({
  identity: { metadata_public: { permissions: Object.assign({}, ...permissions) } },
});

const answered = async answer => {
  fetchMock.get(SESSION_URL, answer);
  await dispatch(storeHoldings());
};

describe('What the caller holds, as their session says', () => {
  beforeEach(() => {
    ({ dispatch, getState } = getStore());
    fetchMock.restore();
    dispatch(setAuthEnabled());
    configure();
  });

  it('reads the permissions from the session, with its cookie', async () => {
    await answered(session(held(LISTING, ALL), held(CREDENTIALS, ALL)));

    expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    expect(fetchMock.lastOptions().credentials).toBe('include');
  });

  it('offers the hub to a caller holding the listing over every DFSP', async () => {
    await answered(session(held(LISTING, ALL)));

    expect(getIsHubOperator(getState())).toBe(true);
    expect(getMaySeeDfsps(getState())).toBe(true);
    expect(getHoldingsError(getState())).toBeUndefined();
  });

  it('offers only DFSPs to a caller holding the listing over some', async () => {
    await answered(session(held(LISTING, [DFSP]), held(CREDENTIALS, [DFSP])));

    expect(getIsHubOperator(getState())).toBe(false);
    expect(getMaySeeDfsps(getState())).toBe(true);
  });

  it('offers nothing to a caller not holding the listing', async () => {
    await answered(session());

    expect(getIsHubOperator(getState())).toBe(false);
    expect(getMaySeeDfsps(getState())).toBe(false);
  });

  it('offers the credentials of exactly the DFSPs held', async () => {
    await answered(session(held(LISTING, [DFSP, OTHER_DFSP]), held(CREDENTIALS, [DFSP])));

    dispatch(setDfspId(DFSP));
    expect(getMayManageCredentials(getState())).toBe(true);
    dispatch(setDfspId(OTHER_DFSP));
    expect(getMayManageCredentials(getState())).toBe(false);
  });

  it('offers the credentials of every DFSP to a caller holding them over all', async () => {
    await answered(session(held(LISTING, ALL), held(CREDENTIALS, ALL)));

    dispatch(setDfspId(OTHER_DFSP));
    expect(getMayManageCredentials(getState())).toBe(true);
  });

  it('offers no credentials to a caller not holding them', async () => {
    await answered(session(held(LISTING, ALL)));

    dispatch(setDfspId(DFSP));
    expect(getMayManageCredentials(getState())).toBe(false);
  });

  it('reports a session that cannot be read, and offers nothing', async () => {
    await answered(500);

    expect(getHoldingsError(getState())).toBe(HOLDINGS_MESSAGES.UNREADABLE);
    expect(getIsHubOperator(getState())).toBe(false);
    expect(getMaySeeDfsps(getState())).toBe(false);
  });

  it('reports a session that cannot be reached, and offers nothing', async () => {
    await answered({ throws: new TypeError('Failed to fetch') });

    expect(getHoldingsError(getState())).toBe(HOLDINGS_MESSAGES.UNREADABLE);
    expect(getMaySeeDfsps(getState())).toBe(false);
  });

  it.each([
    ['a scope over more than one resource name', session({ [LISTING]: { [RESOURCE_NAME]: ALL, other: ALL } }, held(CREDENTIALS, ALL))],
    ['a scope that is neither every id nor a list of ids', session(held(LISTING, 'dfsp1'), held(CREDENTIALS, ALL))],
    ['a held permission without its scope', session({ [LISTING]: {} }, held(CREDENTIALS, ALL))],
  ])('reports a session with %s, and offers nothing', async (_, answer) => {
    await answered(answer);

    expect(getHoldingsError(getState())).toBe(HOLDINGS_MESSAGES.UNEXPECTED);
    expect(getIsHubOperator(getState())).toBe(false);
  });

  it('reports a UI the IAM is not configured for, without asking', async () => {
    configure({ checkSession: SESSION_URL, apiService: undefined });
    fetchMock.get('*', 200);
    await dispatch(storeHoldings());

    expect(fetchMock.calls()).toHaveLength(0);
    expect(getHoldingsError(getState())).toBe(HOLDINGS_MESSAGES.NOT_CONFIGURED);
  });
});

describe('What the caller holds with authentication off', () => {
  beforeEach(() => {
    ({ dispatch, getState } = getStore());
    fetchMock.restore();
    configure();
  });

  it('asks nothing and offers everything', async () => {
    fetchMock.get('*', 200);
    await dispatch(storeHoldings());
    dispatch(setDfspId(DFSP));

    expect(fetchMock.calls()).toHaveLength(0);
    expect(getIsHubOperator(getState())).toBe(true);
    expect(getMayManageCredentials(getState())).toBe(true);
  });
});

describe('The view the caller is offered', () => {
  const dfsps = [{ id: DFSP, name: 'DFSP One' }];
  let container;

  const render = props => {
    act(() => {
      ReactDOM.render(
        <AppSelection
          isPending={false}
          dfsps={dfsps}
          isHubOperator={false}
          maySeeDfsps={true}
          onHubClick={() => {}}
          onDFSPClick={() => {}}
          {...props}
        />,
        container
      );
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  it('shows the hub beside the DFSPs to a hub operator', () => {
    render({ isHubOperator: true });

    expect(container.querySelector('.selection__item--hub')).not.toBeNull();
    expect(container.textContent).toContain('DFSP One');
  });

  it('shows only the DFSPs to anyone else', () => {
    render();

    expect(container.querySelector('.selection__item--hub')).toBeNull();
    expect(container.textContent).toContain('DFSP One');
  });

  it('says so to a caller who may see no DFSP', () => {
    render({ maySeeDfsps: false });

    expect(container.querySelector('.selection__item')).toBeNull();
    expect(container.textContent).toContain(HOLDINGS_MESSAGES.NONE);
  });

  it('shows why the permissions are unknown, and no view', () => {
    render({ holdingsError: HOLDINGS_MESSAGES.UNREADABLE, isHubOperator: true });

    expect(container.querySelector('.selection__item')).toBeNull();
    expect(container.textContent).toContain(HOLDINGS_MESSAGES.UNREADABLE);
  });
});
