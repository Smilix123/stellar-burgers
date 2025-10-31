import reducer, {
  fetchIngredients,
  initialIngredients as initialState
} from './ingredients';
import { TIngredient } from '@utils-types';
import { describe, expect, test } from '@jest/globals';

describe('Слайс ингредиентов', () => {
  const data: TIngredient[] = [
    {
      _id: 'bun1',
      name: 'Булка 1',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 10,
      image: 'bun.png',
      image_large: 'bun.png',
      image_mobile: 'bun.png'
    }
  ];

  test('pending - isLoading: true', () => {
    const state = reducer(initialState, fetchIngredients.pending(''));
    expect(state.data).toEqual([]);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fulfilled - isLoading: false, данные записаны в store', () => {
    const state = reducer(initialState, fetchIngredients.fulfilled(data, ''));
    expect(state.data).toEqual(data);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('rejected - isLoading: false, ошибка записывается в store', () => {
    const state = reducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка'), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
