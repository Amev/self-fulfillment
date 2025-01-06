import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AUTH_STATUSES, AuthStatus } from 'common-types';
import type { RootState } from 'stores/store';
import { postSignOut } from './authClient';

export interface AuthState {
  authStatus: AuthStatus;
}

const initialState: AuthState = {
  authStatus: AUTH_STATUSES.NOT_CHECKED,
};

export const expireSessionAsync = createAsyncThunk('auth/expireSession', () =>
  postSignOut(),
);
export const signoutAsync = createAsyncThunk('auth/signout', () =>
  postSignOut(),
);

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
  },
  extraReducers: (builder) => {
    builder.addCase(signoutAsync.fulfilled, (state) => {
      state.authStatus = AUTH_STATUSES.LOGGED_OUT;
    });
  },
});

export const { changeAuthStatus } = authSlice.actions;
export const getAuthStatus = (state: RootState) => state.auth.authStatus;

export default authSlice.reducer;
