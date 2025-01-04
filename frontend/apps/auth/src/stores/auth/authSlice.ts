import { createSlice } from '@reduxjs/toolkit';
import { AUTH_STATUSES, AuthStatus } from 'common-types';
import type { RootState } from 'stores/store';
import { MfaCredentials, Credentials } from './authTypes';

export interface AuthState {
  authStatus: AuthStatus;
  mfaCredentials?: MfaCredentials;
  credentials?: Credentials;
  resetPasswordEmail?: string;
}

const initialState: AuthState = {
  authStatus: AUTH_STATUSES.NOT_CHECKED,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAuthStatus: (
      state,
      { payload: authStatus }: { payload: AuthStatus },
    ) => {
      state.authStatus = authStatus;
    },
    setMfaCredentials: (
      state,
      { payload: mfaCredentials }: { payload: MfaCredentials },
    ) => {
      state.mfaCredentials = mfaCredentials;
    },
    setCredentials: (
      state,
      { payload: credentials }: { payload: Credentials },
    ) => {
      state.credentials = credentials;
    },
    setResetPasswordEmail: (state, { payload: email }: { payload: string }) => {
      state.resetPasswordEmail = email;
    },
  },
});

export const {
  changeAuthStatus,
  setMfaCredentials,
  setCredentials,
  setResetPasswordEmail,
} = authSlice.actions;
export const getAuthStatus = (state: RootState) => state.auth.authStatus;
export const getCredentials = (state: RootState) => state.auth.credentials;
export const getMfaCredentials = (state: RootState) =>
  state.auth.mfaCredentials;
export const getResetPasswordEmail = (state: RootState) =>
  state.auth.resetPasswordEmail;

export default authSlice.reducer;
