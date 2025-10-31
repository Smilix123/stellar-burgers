import reducer, {
  clearProfile,
  clearProfileError,
  fetchProfile,
  initialProfile as initialState
} from './profile';
import { TUserResponse } from '../utils/burger-api';
import { describe, expect, test } from '@jest/globals';

describe('Слайс профиля', () => {
  const data: TUserResponse = {
    success: true,
    user: {
      email: 'test@example.com',
      name: 'Test User'
    }
  };

  test('pending - isLoading: true', () => {
    const state = reducer(initialState, fetchProfile.pending(''));
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fulfilled - isLoading: false, данные записаны в store', () => {
    const state = reducer(initialState, fetchProfile.fulfilled(data.user, ''));
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(data.user);
    expect(state.error).toBe(null);
  });

  test('rejected - isLoading: false, ошибка записывается в store', () => {
    const state = reducer(
      initialState,
      fetchProfile.rejected(new Error('Ошибка'), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  test('Очистка ошибки', () => {
    const state = reducer(
      initialState,
      fetchProfile.rejected(new Error('Ошибка'), '')
    );
    const newState = reducer(state, clearProfileError());
    expect(newState.error).toBe(null);
  });
  test('Очистка профиля', () => {
    const state = reducer(initialState, fetchProfile.fulfilled(data.user, ''));
    const newState = reducer(state, clearProfile());
    expect(newState.user).toBe(null);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });
});
