/* eslint-disable no-empty */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from 'libs/requests';
import profileApi from './profileApi';

const securityProfileApi = createApi({
  reducerPath: 'credentials',
  baseQuery: axiosBaseQuery({ baseUrl: '/auth/credentials' }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    updatePassword: build.mutation<
      void,
      { userID: string; currentPassword: string; newPassword: string }
    >({
      query: ({ userID, currentPassword, newPassword }) => ({
        url: `/${userID}/update_password/`,
        method: 'POST',
        data: { currentPassword, newPassword },
      }),
    }),
    requestMailOTP: build.mutation<
      void,
      { userID: string; email: string; password: string }
    >({
      query: ({ userID, email, password }) => ({
        url: `/${userID}/request_email/`,
        method: 'POST',
        data: { email, password },
      }),
    }),
    confirmMailWithOTP: build.mutation<
      void,
      { userID: string; email: string; otp: string }
    >({
      query: ({ userID, email, otp }) => ({
        url: `/${userID}/confirm_email/`,
        method: 'POST',
        data: { email, otp },
      }),
      onQueryStarted: async (value, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            'getUser',
            undefined,
            (previousUser) => ({
              ...previousUser,
              email: value.email,
            }),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    requestMfaOTP: build.mutation<
      void,
      { userID: string; phone: string; password: string }
    >({
      query: ({ userID, phone, password }) => ({
        url: `/${userID}/request_mfa_otp/`,
        method: 'POST',
        data: { phone, password },
      }),
    }),
    confirmMfaWithOTP: build.mutation<
      void,
      { userID: string; phone: string; otp: string }
    >({
      query: ({ userID, phone, otp }) => ({
        url: `/${userID}/confirm_mfa_otp/`,
        method: 'POST',
        data: { phone, otp },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            profileApi.util.updateQueryData(
              'getUser',
              undefined,
              (previousUser) => ({
                ...previousUser,
                mfa: true,
              }),
            ),
          );
        } catch {}
      },
    }),
  }),
});

export default securityProfileApi;

export const {
  useUpdatePasswordMutation,
  useConfirmMailWithOTPMutation,
  useRequestMfaOTPMutation,
  useConfirmMfaWithOTPMutation,
  useRequestMailOTPMutation,
} = securityProfileApi;
