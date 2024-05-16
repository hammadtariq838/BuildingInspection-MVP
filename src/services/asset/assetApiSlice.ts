import {
  fetchBaseQuery,
  createApi,
  FetchArgs,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/constants';
import { RootState } from '@/app/store';
import { clearAuth } from '@/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL + '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth
      .accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

async function baseQueryWithAuth(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extra: object
) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());
  }
  return result;
}

export const assetApiSlice = createApi({
  reducerPath: 'assetApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    getAssets: builder.query({
      query: ({ projectId }) =>
        `/project/${projectId}/asset/`,
      providesTags: ['Asset'],
    }),
    getAssetById: builder.query({
      query: ({ projectId, id }) =>
        `/project/${projectId}/asset/${id}/`,
      providesTags: ['Asset'],
    }),
    addAsset: builder.mutation({
      query: ({ projectId, asset_images }) => ({
        url: `/project/${projectId}/asset/`,
        method: 'POST',
        body: asset_images,
      }),
      invalidatesTags: ['Asset'],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useAddAssetMutation,
} = assetApiSlice;
