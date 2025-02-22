import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AuthenticationError,
  GenericError,
  User,
  ValidationError,
} from '../../types';
import { RootState } from '../../app/store';
import { login, register, logout, loginWithGoogle } from './usersThunk';
import { isValidationError } from '../../helpers/error-helpers';

interface State {
  user: User | null;
  loading: boolean;
  error: AuthenticationError | ValidationError | GenericError | null;
}

const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clear: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state, { payload }: PayloadAction<string | undefined>) => {
      if (isValidationError(state.error) && payload) {
        delete state.error.errors[payload];

        if (!Object.keys(state.error.errors).length) {
          state.error = null;
        }
      } else {
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload ?? {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(register.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload ?? {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addCase(logout.rejected, (state, { error }) => {
        state.user = null;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(loginWithGoogle.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      });
  },
});

export const users = slice.reducer;
export const { clearError, clear } = slice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;
