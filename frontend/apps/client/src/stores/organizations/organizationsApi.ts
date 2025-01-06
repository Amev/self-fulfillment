/* eslint-disable no-empty */
import { createApi } from '@reduxjs/toolkit/query/react';
import { RcFile } from 'antd/es/upload';
import { Organization, Permission } from 'common-types';
import { axiosBaseQuery } from 'libs/requests';

const organizationsApi = createApi({
  reducerPath: 'organizations',
  baseQuery: axiosBaseQuery({ baseUrl: '/organizations' }),
  tagTypes: ['Organizations'],
  endpoints: (build) => ({
    getOrganizations: build.query<Organization[], void>({
      query: () => ({ url: '/', method: 'GET' }),
      providesTags: ['Organizations'],
    }),
    getOrganization: build.query<Organization, string>({
      query: (id) => ({ url: `/${id}/`, method: 'GET' }),
    }),
    updateOrganization: build.mutation<
      Organization,
      { id: string; enableRedeemCode: boolean; name: string }
    >({
      query: ({ id, enableRedeemCode, name }) => ({
        url: `/${id}/`,
        method: 'PATCH',
        data: {
          enableRedeemCode,
          name,
        },
      }),
      onQueryStarted: async (
        { id, name, enableRedeemCode },
        { dispatch, queryFulfilled },
      ) => {
        try {
          const { data: orga } = await queryFulfilled;
          dispatch(
            organizationsApi.util.updateQueryData(
              'getOrganization',
              id,
              () => ({ ...orga, name, enableRedeemCode }),
            ),
          );

          dispatch(
            organizationsApi.util.updateQueryData(
              'getOrganizations',
              undefined,
              (organizations) => {
                const index = organizations.findIndex(
                  (org) => org.info.id === id,
                );
                if (index > -1) {
                  organizations[index] = {
                    ...orga,
                  };
                }
              },
            ),
          );
        } catch {}
      },
    }),
    uploadLogo: build.mutation<Organization, { id: string; logo: RcFile }>({
      query: ({ id, logo }) => {
        const data = new FormData();
        data.append('file', logo);

        return {
          url: `/${id}/upload/`,
          method: 'POST',
          data,
        };
      },
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: orga } = await queryFulfilled;
          dispatch(
            organizationsApi.util.updateQueryData(
              'getOrganization',
              id,
              () => orga,
            ),
          );
          dispatch(
            organizationsApi.util.updateQueryData(
              'getOrganizations',
              undefined,
              (organizations) => {
                const index = organizations.findIndex(
                  (org) => org.info.id === id,
                );
                if (index > -1) {
                  organizations[index] = {
                    ...orga,
                  };
                }
              },
            ),
          );
        } catch {}
      },
    }),
    createOrganization: build.mutation<Organization, { name: string }>({
      query: ({ name }) => ({
        url: '/',
        method: 'POST',
        data: {
          name,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: orga } = await queryFulfilled;
          dispatch(
            organizationsApi.util.updateQueryData(
              'getOrganizations',
              undefined,
              (organizations) => {
                organizations.push(orga);
              },
            ),
          );
        } catch {}
      },
    }),
    deleteOrganization: build.mutation<Organization, string>({
      query: (id: string) => ({
        url: `/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organizations'],
    }),
    updateUserPermission: build.mutation<
      Organization,
      { id: string; userID: string; permission: Permission }
    >({
      query: ({ id, userID, permission }) => ({
        url: `/${id}/promote/`,
        method: 'PATCH',
        data: {
          level: permission,
          to_promote: userID,
        },
      }),
    }),
    inviteUser: build.mutation<
      Organization,
      { id: string; email: string; permission: Permission }
    >({
      query: ({ id, email, permission }) => ({
        url: `/${id}/invite/`,
        method: 'POST',
        data: {
          level: permission,
          email,
        },
      }),
    }),
  }),
});

export default organizationsApi;

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useUploadLogoMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useCreateOrganizationMutation,
  useUpdateUserPermissionMutation,
  useInviteUserMutation,
} = organizationsApi;
