/* eslint-disable no-empty */
import { createApi } from '@reduxjs/toolkit/query/react';
import { RcFile } from 'antd/es/upload';
import { AUTH_STATUSES, User } from 'common-types';
import { axiosBaseQuery } from 'libs/requests';
import { changeAuthStatus } from 'stores/auth/authSlice';

const profileApi = createApi({
  reducerPath: 'user',
  baseQuery: axiosBaseQuery({ baseUrl: '/users/user' }),
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => ({ url: '/', method: 'GET' }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(changeAuthStatus(AUTH_STATUSES.LOGGED));
        } catch (_error) {
          dispatch(changeAuthStatus(AUTH_STATUSES.NOT_LOGGED));
        }
      },
    }),
    updateUser: build.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...user }) => ({
        url: `/${id}/`,
        method: 'PATCH',
        data: user,
      }),
    }),
    uploadAvatar: build.mutation<User, { userID: string; avatar: RcFile }>({
      query: ({ userID, avatar }) => {
        const data = new FormData();
        data.append('file', avatar);

        return {
          url: `/${userID}/upload/`,
          method: 'POST',
          data,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(
            profileApi.util.updateQueryData('getUser', undefined, () => user),
          );
        } catch {}
      },
    }),
  }),
});

export default profileApi;

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} = profileApi;
