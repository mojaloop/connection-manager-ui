import { getStore } from 'tests/store';

it('Creates all the reducers', () => {
  const store = getStore();
  const state = store.getState();

  expect(state.app).toBeDefined();
  expect(state.dfsp).toBeDefined();
  expect(state.hub).toBeDefined();
});
