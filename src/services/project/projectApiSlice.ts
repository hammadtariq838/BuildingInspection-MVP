import {
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '@/constants';
import { RootState } from '@/app/store';
import { Project } from '@/types';

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

export const projectApiSlice = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQuery,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects/',
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}/`,
    }),
    addProject: builder.mutation<
      Project,
      { project_name: string }
    >({
      query: (newProject) => ({
        url: '/projects/',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/projects/${id}/`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApiSlice;
