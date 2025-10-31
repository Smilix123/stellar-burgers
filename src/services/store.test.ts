import { rootReducer } from './store';
import { describe, expect, test } from '@jest/globals';
import { initialProfile as profileState } from './profile';
import { initialOrders as ordersState } from './orders';
import { initialIngredients as ingredientsState } from './ingredients';
import { initialFeeds as feedsState } from './feeds';
import { initialConstructor as constructorState } from './burger-constructor';
import { initialOrderCreate as orderCreateState } from './order-create';

describe('Store', () => {
  test('Инициализация rootReducer', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: ingredientsState,
      burgerConstructor: constructorState,
      profile: profileState,
      orderCreate: orderCreateState,
      feeds: feedsState,
      orders: ordersState
    });
  });
});
