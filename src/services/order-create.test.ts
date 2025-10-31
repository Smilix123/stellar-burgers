import {
  orderCreateSlice,
  clearCreateOrderError,
  clearOrder,
  createOrder,
  initialOrderCreate as initialState
} from './order-create';
import { TOrder } from '@utils-types';
import { describe, expect, test } from '@jest/globals';

const reducer = orderCreateSlice.reducer;

describe('Слайс создания заказа', () => {
  const orderData: TOrder = {
    _id: 'order1',
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    number: 123,
    ingredients: ['bun1', 'main1', 'sauce1', 'bun1']
  };

  test('pending - isLoading: true, error: null', () => {
    const state = reducer(
      initialState,
      createOrder.pending('', ['bun1', 'main1'])
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fulfilled - isLoading: false, заказ записан в store', () => {
    const state = reducer(
      initialState,
      createOrder.fulfilled(orderData, '', ['bun1', 'main1'])
    );
    expect(state.loading).toBe(false);
    expect(state.Order).toEqual(orderData);
    expect(state.error).toBe(null);
  });

  test('rejected - isLoading: false, ошибка записывается в store', () => {
    const state = reducer(
      initialState,
      createOrder.rejected(new Error('Ошибка'), '', ['bun1', 'main1'])
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  test('rejected с rejectWithValue - используется payload ошибки', () => {
    const baseAction = createOrder.rejected(new Error('Ошибка'), '', [
      'bun1',
      'main1'
    ]);
    const action = {
      ...baseAction,
      payload: 'Ошибка создания заказа' as string
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  test('Очистка ошибки', () => {
    const stateWithError = reducer(
      initialState,
      createOrder.rejected(new Error('Ошибка'), '', ['bun1', 'main1'])
    );
    const newState = reducer(stateWithError, clearCreateOrderError());
    expect(newState.error).toBe(null);
  });

  test('Очистка заказа', () => {
    const stateWithOrder = reducer(
      initialState,
      createOrder.fulfilled(orderData, '', ['bun1', 'main1'])
    );
    const newState = reducer(stateWithOrder, clearOrder());
    expect(newState.Order).toBe(null);
  });
});
