import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from './store';

interface OrderCreateState {
  Order: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialOrderCreate: OrderCreateState = {
  Order: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('ingredients/createOrder', async (ingredientsId, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredientsId);
    return data.order;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка создания заказа');
  }
});

export const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState: initialOrderCreate,
  reducers: {
    clearCreateOrderError(state) {
      state.error = null;
    },
    clearOrder(state) {
      state.Order = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createOrder.fulfilled,
      (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.Order = action.payload;
      }
    );
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Ошибка создания заказа';
    });
  }
});

export const { clearCreateOrderError, clearOrder } = orderCreateSlice.actions;

export const selectLastCreatedOrder = (state: RootState) =>
  state.orderCreate.Order;
export const selectCreateOrderLoading = (state: RootState) =>
  state.orderCreate.loading;
export const selectCreateOrderError = (state: RootState) =>
  state.orderCreate.error;
