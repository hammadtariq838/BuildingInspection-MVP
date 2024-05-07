import {
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/constants';
import { RootState } from '@/app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth
      .accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
// credentials: 'include',

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { access: string; refresh: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/api/token/',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<
      void,
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/api/user/register/',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<
      { access: string },
      { refresh: string }
    >({
      query: () => ({
        url: '/api/token/refresh/',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = userApiSlice;
