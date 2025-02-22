import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AuthenticationError,
  GenericError,
  User,
  ValidationError,
} from '../../types';
import { isValidationError } from '../../helpers/error-helpers';
import { RootState } from '../../app/store';
import { signIn, signUp, signOut, signInWithGoogle } from './usersThunk';

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
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(signIn.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload ?? {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(signUp.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload ?? {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(signOut.pending, (state) => {
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addCase(signOut.rejected, (state, { error }) => {
        state.user = null;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(signInWithGoogle.rejected, (state, { error }) => {
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
