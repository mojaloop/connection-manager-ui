import { getStore } from 'tests/store';

describe('Redux Store Reducers', () => {
  let store;

  beforeEach(() => {
    store = getStore(); // Reuse store setup to avoid redundant calls
  });

  it('Creates all the reducers', () => {
    const state = store.getState();

    expect(state).toHaveProperty('app');
    expect(state).toHaveProperty('dfsp');
    expect(state).toHaveProperty('hub');

    // Optional: Check if initial state values are correct
    expect(state.app).toBeInstanceOf(Object);
    expect(state.dfsp).toBeInstanceOf(Object);
    expect(state.hub).toBeInstanceOf(Object);
  });
});
