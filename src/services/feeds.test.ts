import { TFeedsResponse } from '@api';
import reducer, {
  clearFeedsError,
  fetchFeeds,
  initialFeeds as initialState
} from './feeds';
import { describe, expect, test } from '@jest/globals';

describe('Слайс ленты', () => {
  const data: TFeedsResponse = {
    success: true,
    orders: [
      {
        _id: 'order1',
        status: 'done',
        name: 'Тестовый бургер',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        number: 123,
        ingredients: ['bun1', 'main1', 'sauce1', 'bun1']
      }
    ],
    total: 1,
    totalToday: 2
  };

  test('pending - isLoading: true', () => {
    const state = reducer(initialState, fetchFeeds.pending(''));
    expect(state.loading).toBe(true);
  });

  test('fulfilled - isLoading: false, данные записаны в store', () => {
    const state = reducer(initialState, fetchFeeds.fulfilled(data, ''));
    expect(state.loading).toBe(false);
    expect(state.data?.orders).toEqual(data.orders);
    expect(state.data?.total).toEqual(data.total);
    expect(state.data?.totalToday).toEqual(data.totalToday);
  });

  test('rejected - isLoading: false, ошибка записывается в store', () => {
    const state = reducer(
      initialState,
      fetchFeeds.rejected(new Error('Ошибка'), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  test('Очистка ошибки', () => {
    const state = reducer(
      initialState,
      fetchFeeds.rejected(new Error('Ошибка'), '')
    );
    const newState = reducer(state, clearFeedsError());
    expect(newState.error).toBe(null);
  });
});
