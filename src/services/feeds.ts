import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from './store';

interface FeedsState {
  data: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  } | null;

  loading: boolean;
  error: string | null;
}

export const initialFeeds: FeedsState = {
  data: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feeds/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка загрузки ленты');
  }
});

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: initialFeeds,
  reducers: {
    clearFeedsError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchFeeds.fulfilled,
      (
        state,
        action: PayloadAction<{
          orders: TOrder[];
          total: number;
          totalToday: number;
        }>
      ) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(fetchFeeds.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Ошибка загрузки ленты';
    });
  }
});

export const selectFeeds = (state: RootState) => state.feeds.data;
export const selectFeedsLoading = (state: RootState) => state.feeds.loading;
export const selectFeedsError = (state: RootState) => state.feeds.error;

export const { clearFeedsError } = feedsSlice.actions;
