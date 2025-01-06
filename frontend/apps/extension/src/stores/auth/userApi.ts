/* eslint-disable no-empty */
import { createApi } from '@reduxjs/toolkit/query/react';
import { AUTH_STATUSES, User } from 'common-types';
import { axiosBaseQuery } from 'libs/requests';
import { changeAuthStatus } from './authSlice';
import { ProviderCredentials } from './authTypes';

const authApi = createApi({
  reducerPath: 'user',
  baseQuery: axiosBaseQuery({ baseUrl: '/users' }),
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => ({ url: '/user/', method: 'GET' }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(changeAuthStatus(AUTH_STATUSES.LOGGED));
        } catch (_error) {
          dispatch(changeAuthStatus(AUTH_STATUSES.NOT_LOGGED));
        }
      },
    }),
    signInProvider: build.mutation<void, ProviderCredentials>({
      query: ({ clientId, code, provider }) => ({
        url: `/${provider}/`,
        method: 'POST',
        data: {
          clientId,
          code,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(changeAuthStatus(AUTH_STATUSES.LOGGED));
        } catch {}
      },
    }),
  }),
});

export default authApi;

export const { useGetUserQuery, useSignInProviderMutation } = authApi;
