/* eslint-disable no-underscore-dangle */
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const ROOT_API_URL =
  import.meta.env.VITE_ROOT_API_URL || 'http://localhost:8000';

const Request = axios.create({
  baseURL: ROOT_API_URL,
  withCredentials: true,
});

Request.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Not authorized, try to refresh token
    if (error.response?.status === 403 || error.response?.status === 401) {
      try {
        await axios({
          method: 'POST',
          url: `${ROOT_API_URL}/users/user/refresh/`,
          withCredentials: true,
        });
      } catch (_) {
        return Promise.reject(error);
      }

      return axios.request(error.config);
    }

    return Promise.reject(error);
  },
);

export default Request;

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await Request({
        url: `${ROOT_API_URL}${baseUrl}${url}`,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export { axiosBaseQuery };
