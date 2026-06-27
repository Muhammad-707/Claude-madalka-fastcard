import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, UserProfile, UserFilters, AddRoleParams, Role, RegisterDto } from '@/shared/api/types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getUsers: b.query<Paginated<UserProfile>, UserFilters | void>({
      query: (params) => ({
        url: '/UserProfile/get-user-profiles',
        params: params ?? {},
        responseHandler: async (response: Response) => {
          const EMPTY: Paginated<UserProfile> = {
            pageNumber: 1, pageSize: 10, totalPage: 0, totalRecord: 0,
            data: [], errors: [], statusCode: 200,
          }
          const json = await response.json().catch(() => null)
          if (!json) return EMPTY
          const candidate = json?.data
          // Wrapped: { data: Paginated<UserProfile>, errors, statusCode }
          if (candidate && typeof candidate === 'object' && !Array.isArray(candidate) &&
              ('pageNumber' in candidate || 'totalRecord' in candidate)) {
            return candidate
          }
          // Flat: { pageNumber, totalRecord, data: [...], errors, statusCode }
          if ('pageNumber' in json || 'totalRecord' in json) return json
          return EMPTY
        },
      }),
      providesTags: ['User'],
    }),
    // GET /UserProfile/get-user-profile-by-id?id={string}
    // Used to fetch full profile data (including dob, image) before opening the edit modal.
    getUserById: b.query<UserProfile, string>({
      query: (id) => ({ url: '/UserProfile/get-user-profile-by-id', params: { id } }),
      transformResponse: (r: { data: UserProfile | null }) => r.data!,
      providesTags: (_r, _e, id) => [{ type: 'User' as const, id }],
    }),
    updateUser: b.mutation<unknown, FormData>({
      query: (body) => ({ url: '/UserProfile/update-user-profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    deleteUser: b.mutation<unknown, string>({
      query: (id) => ({ url: '/UserProfile/delete-user', method: 'DELETE', params: { id } }),
      invalidatesTags: ['User'],
    }),
    getRoles: b.query<Role[], void>({
      query: () => '/UserProfile/get-user-roles',
      transformResponse: (r: { data: Role[] | null }) => r.data ?? [],
      providesTags: ['Role'],
    }),
    addRole: b.mutation<unknown, AddRoleParams>({
      query: (params) => ({ url: '/UserProfile/addrole-from-user', method: 'POST', params }),
      invalidatesTags: ['User'],
    }),
    removeRole: b.mutation<unknown, AddRoleParams>({
      query: (params) => ({ url: '/UserProfile/remove-role-from-user', method: 'DELETE', params }),
      invalidatesTags: ['User'],
    }),
    addUser: b.mutation<unknown, RegisterDto>({
      query: (body) => ({ url: '/Account/register', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAddRoleMutation,
  useRemoveRoleMutation,
  useAddUserMutation,
} = usersApi
