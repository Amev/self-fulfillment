/* eslint-disable no-empty */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'libs/requests';
import {
  setCredentials,
  setMfaCredentials,
  setResetPasswordEmail,
} from './authSlice';
import {
  ConfirmCredentials,
  ConfirmMfaCredentials,
  Credentials,
  SignInResponse,
  SignInResponseCode,
  SignUpResendCode,
} from './authTypes';

const authApi = createApi({
  reducerPath: 'credentials',
  baseQuery: axiosBaseQuery({ baseUrl: '/auth/credentials' }),
  endpoints: (build) => ({
    signInCredentials: build.mutation<SignInResponse, Credentials>({
      query: (credentials) => ({
        url: '/signin/',
        method: 'POST',
        data: {
          username: credentials.email,
          password: credentials.password,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: response } = await queryFulfilled;

          if (response.mfa) {
            dispatch(
              setMfaCredentials({
                phone: response.phone || '',
                csrf: response.csrf || '',
              }),
            );
          }
        } catch {}
      },
    }),
    confirmCredentialsMfa: build.mutation<
      SignInResponseCode,
      ConfirmMfaCredentials
    >({
      query: ({ csrf, otp }) => ({
        url: '/mfa/',
        method: 'POST',
        data: {
          code: otp,
          csrf,
        },
      }),
    }),
    signUpCredentials: build.mutation<void, Credentials>({
      query: ({ email, password }) => ({
        url: '/register/',
        method: 'POST',
        data: {
          username: email,
          password,
        },
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(setCredentials(credentials));
        } catch {}
      },
    }),
    signUpResendCode: build.mutation<void, SignUpResendCode>({
      query: ({ email }) => ({
        url: '/register_resend_code/',
        method: 'POST',
        data: {
          username: email,
        },
      }),
    }),
    confirmCredentialsEmail: build.mutation<
      SignInResponseCode,
      ConfirmCredentials
    >({
      query: ({ email, otp, password }) => ({
        url: '/confirm/',
        method: 'POST',
        data: {
          code: otp,
          username: email,
          password,
        },
      }),
    }),
    requestResetPassword: build.mutation<void, string>({
      query: (username) => ({
        url: '/forgot_password/',
        method: 'POST',
        data: { username },
      }),
      onQueryStarted: async (email, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(setResetPasswordEmail(email));
        } catch {}
      },
    }),
    confirmResetPassword: build.mutation<
      SignInResponseCode,
      ConfirmCredentials
    >({
      query: ({ email, otp, password }) => ({
        url: '/new_password/',
        method: 'POST',
        data: {
          code: otp,
          username: email,
          password,
        },
      }),
    }),
  }),
});

export default authApi;

export const {
  useConfirmCredentialsEmailMutation,
  useConfirmCredentialsMfaMutation,
  useConfirmResetPasswordMutation,
  useRequestResetPasswordMutation,
  useSignInCredentialsMutation,
  useSignUpCredentialsMutation,
  useSignUpResendCodeMutation,
} = authApi;
