import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';
import { RootState } from './store';

interface ProfileState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
}

export const initialProfile: ProfileState = {
  user: null,
  loading: false,
  error: null
};

export const fetchProfile = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getUserApi();
    return data.user;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка получения данных профиля');
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (form, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(form);
    if (data.refreshToken)
      localStorage.setItem('refreshToken', data.refreshToken);
    if (data.accessToken) setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('auth/login', async (loginData, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(loginData);
    if (data.refreshToken)
      localStorage.setItem('refreshToken', data.refreshToken);
    if (data.accessToken) setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка входа');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '');
      return;
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        return rejectWithValue((err as { message: string }).message);
      }
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  boolean,
  { email: string },
  { rejectValue: string }
>('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(payload);
    return true;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка восстановления пароля');
  }
});

export const resetPassword = createAsyncThunk<
  boolean,
  { password: string; token: string },
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await resetPasswordApi(payload);
    return true;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка сброса пароля');
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(payload);
    return data.user;
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return rejectWithValue((err as { message: string }).message);
    }
    return rejectWithValue('Ошибка обновления профиля');
  }
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfile,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    clearProfile(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = true;
      state.error =
        action.payload ?? action.error.message ?? 'Ошибка загрузки данных';
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Ошибка регистрации';
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Ошибка ';
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Ошибка ';
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ??
        action.error.message ??
        'Ошибка обновления данных профиля';
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ??
        action.error.message ??
        'Ошибка запроса восстановления пароля';
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Ошибка сброса пароля';
    });
  }
});

export const { clearProfileError, clearProfile } = profileSlice.actions;

export const selectUserProfile = (state: RootState) => state.profile.user;
export const selectUserProfileLoading = (state: RootState) =>
  state.profile.loading;
export const selectUserProfileError = (state: RootState) => state.profile.error;
