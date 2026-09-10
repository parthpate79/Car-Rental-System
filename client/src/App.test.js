import { carsReducer } from './redux/reducers/carsReducer';

test('a failed refresh preserves the fleet and exposes a recoverable error', () => {
  const state = { cars: [{ _id: 'car-1' }], error: null };
  const failed = carsReducer(state, { type: 'CARS_ERROR', payload: 'Unavailable' });
  expect(failed.cars).toEqual(state.cars);
  expect(failed.error).toBe('Unavailable');
  expect(carsReducer(failed, { type: 'GET_ALL_CARS', payload: [] }).error).toBeNull();
});
