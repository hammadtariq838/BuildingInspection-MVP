import {
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/constants';
import { RootState } from '@/app/store';
import { Asset, AssetWithResults, Result } from '@/types';

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

export const assetApiSlice = createApi({
  reducerPath: 'assetApi',
  baseQuery: baseQuery,
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    // getAssetsWithResults: builder.query<
    //   AssetWithResults[],
    //   {
    //     projectId: string;
    //   }
    // >({
    //   query: ({ projectId }) =>
    //     `/projects/${projectId}/assets-with-results/`,
    // }),
    processAssets: builder.mutation<
      Result[],
      { projectId: string }
    >({
      query: ({ projectId }) => ({
        url: `/projects/${projectId}/process-assets/`,
        method: 'POST',
      }),
    }),
    bulkUploadAssets: builder.mutation<
      Asset[],
      { projectId: string; asset_images: FormData }
    >({
      query: ({ projectId, asset_images }) => ({
        url: `/projects/${projectId}/bulk-upload/`,
        method: 'POST',
        body: asset_images,
      }),
    }),
    getAssetsByProject: builder.query<
      AssetWithResults[],
      { projectId: string }
    >({
      query: ({ projectId }) =>
        `/assets/?project=${projectId}`,
    }),
    getAssetById: builder.query({
      query: (id) => `/assets/${id}/`,
    }),
    addAsset: builder.mutation({
      query: (newAsset) => ({
        url: '/assets/',
        method: 'POST',
        body: newAsset,
      }),
    }),
    updateAsset: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/assets/${id}/`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `/assets/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  // useGetAssetsWithResultsQuery,
  useProcessAssetsMutation,
  useBulkUploadAssetsMutation,
  useGetAssetsByProjectQuery,
  useGetAssetByIdQuery,
  useAddAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetApiSlice;
