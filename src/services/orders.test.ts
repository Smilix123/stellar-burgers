import reducer, {
  fetchUserOrders,
  initialOrders as initialState
} from './orders';
import { TFeedsResponse } from '@api';
import { describe, expect, test } from '@jest/globals';

describe('Слайс заказов пользователя', () => {
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
    const state = reducer(initialState, fetchUserOrders.pending(''));
    expect(state.loading).toBe(true);
  });

  test('fulfilled - isLoading: false, данные записаны в store', () => {
    const state = reducer(
      initialState,
      fetchUserOrders.fulfilled(data.orders, '')
    );
    expect(state.loading).toBe(false);
    expect(state.list).toEqual(data.orders);
  });

  test('rejected - isLoading: false, ошибка записывается в store', () => {
    const state = reducer(
      initialState,
      fetchUserOrders.rejected(new Error('Ошибка'), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
