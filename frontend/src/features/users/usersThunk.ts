import { isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  googleSignInEndpoint,
  sessionsEndpoint,
  usersEndpoint,
} from '../../constants';
import {
  AuthenticationError,
  Session,
  User,
  SignInMutation,
  SignUpMutation,
  ValidationError,
} from '../../types';
import {
  isAuthenticationError,
  isValidationError,
} from '../../helpers/error-helpers';
import { api } from '../../api';

export const signUp = createAsyncThunk<
  User,
  SignUpMutation,
  { rejectValue: ValidationError }
>('users/signUp', async (mutation, { rejectWithValue }) => {
  try {
    const body = new FormData();
    body.append('username', mutation.username);
    body.append('password', mutation.password);
    body.append('displayName', mutation.displayName);
    if (mutation.avatar) {
      body.append('avatar', mutation.avatar);
    }

    const { data } = await api.post<User>(usersEndpoint, body);

    return data;
  } catch (e) {
    if (
      isAxiosError(e) &&
      e.response?.status === 400 &&
      isValidationError(e.response.data)
    ) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const signIn = createAsyncThunk<
  Session,
  SignInMutation,
  { rejectValue: AuthenticationError }
>('users/signIn', async (mutation, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Session>(sessionsEndpoint, mutation);

    return data;
  } catch (e) {
    if (
      isAxiosError(e) &&
      e.response?.status === 401 &&
      isAuthenticationError(e.response.data)
    ) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const signOut = createAsyncThunk('users/signOut', async () => {
  const { data } = await api.delete<Session>(sessionsEndpoint);

  return data;
});

export const signInWithGoogle = createAsyncThunk<Session, string>(
  'users/signInWithGoogle',
  async (credential) => {
    const { data } = await api.post<Session>(googleSignInEndpoint, {
      credential,
    });
    return data;
  },
);
