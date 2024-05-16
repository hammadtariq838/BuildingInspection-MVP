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

export const projectApiSlice = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/project/',
      providesTags: ['Project'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProjectById: builder.query<any, string>({
      query: (id) => `/project/${id}/`,
    }),
    addProject: builder.mutation({
      query: (newProject) => ({
        url: '/project/',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project'],
    }),
    // deleteProject: builder.mutation({
    //   query: (id) => ({
    //     url: `/project/${id}/`,
    //     method: 'DELETE',
    //   }),
    // }),
    getTemplates: builder.query({
      query: () => '/project/template',
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useAddProjectMutation,
  useGetTemplatesQuery,
  // useDeleteProjectMutation,
} = projectApiSlice;
