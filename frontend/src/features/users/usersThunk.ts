import { isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  AuthenticationError,
  Session,
  User,
  SignInMutation,
  SignUpMutation,
  ValidationError,
} from '../../types';
import { api } from '../../api';
import {
  isAuthenticationError,
  isValidationError,
} from '../../helpers/error-helpers';

export const register = createAsyncThunk<
  User,
  SignUpMutation,
  { rejectValue: ValidationError }
>('users/register', async (mutation, { rejectWithValue }) => {
  try {
    const body = new FormData();
    body.append('email', mutation.email);
    body.append('password', mutation.password);
    body.append('displayName', mutation.displayName);
    if (mutation.avatar) {
      body.append('avatar', mutation.avatar);
    }

    const { data } = await api.post<User>('users', body);

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

export const login = createAsyncThunk<
  Session,
  SignInMutation,
  { rejectValue: AuthenticationError }
>('users/login', async (mutation, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Session>('users/sessions', mutation);

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

export const logout = createAsyncThunk('users/logout', async () => {
  const { data } = await api.delete<Session>('users/sessions');

  return data;
});

export const loginWithGoogle = createAsyncThunk<Session, string>(
  'users/loginWithGoogle',
  async (credential) => {
    const { data } = await api.post<Session>('users/google', { credential });
    return data;
  },
);
