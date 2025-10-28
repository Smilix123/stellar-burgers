import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './ingredients';
import { burgerConstructorSlice } from './burger-constructor';
import { profileSlice } from './profile';
import { orderCreateSlice } from './order-create';
import { feedsSlice } from './feeds';
import { ordersSlice } from './orders';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  profile: profileSlice.reducer,
  orderCreate: orderCreateSlice.reducer,
  feeds: feedsSlice.reducer,
  orders: ordersSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
