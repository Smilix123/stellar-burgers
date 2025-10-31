import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialConstructor as initialState
} from './burger-constructor';
import { TConstructorIngredient } from '@utils-types';
import { describe, expect, test } from '@jest/globals';

jest.mock('uuid', () => ({
  v4: () => '1'
}));

describe('Слайс конструктора', () => {
  const main: TConstructorIngredient = {
    id: '1',
    _id: 'main1',
    name: 'Котлета 1',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: 'main.png',
    image_large: 'main.png',
    image_mobile: 'main.png'
  };

  test('Добавление ингредиента', () => {
    const state = reducer(initialState, addIngredient(main));
    expect(state.selectedIngredients).toEqual([main]);
  });

  test('Удаление ингредиента', () => {
    const state = reducer(initialState, addIngredient(main));
    const newState = reducer(state, removeIngredient(0));
    expect(newState.selectedIngredients).toEqual([]);
  });

  test('Перемещение ингредиента', () => {
    const main2 = { ...main, _id: 'main2' };
    let state = reducer(initialState, addIngredient(main));
    state = reducer(state, addIngredient(main2));
    state = reducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(state.selectedIngredients.map((item) => item._id)).toEqual([
      'main2',
      'main1'
    ]);
  });

  test('Очистка конструктора', () => {
    const state = reducer(initialState, addIngredient(main));
    const newState = reducer(state, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
