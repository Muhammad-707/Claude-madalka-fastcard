import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, UserProfile, UserFilters, AddRoleParams, Role, RegisterDto } from '@/shared/api/types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getUsers: b.query<Paginated<UserProfile>, UserFilters | void>({
      query: (params) => ({ url: '/UserProfile/get-user-profiles', params: params ?? {} }),
      providesTags: ['User'],
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
      query: () => '/Role/get-user-roles',
      transformResponse: (r: { data: Role[] | null }) => r.data ?? [],
      providesTags: ['Role'],
    }),
    addRole: b.mutation<unknown, AddRoleParams>({
      query: (params) => ({ url: '/Role/addrole-from-user', method: 'POST', params }),
      invalidatesTags: ['User'],
    }),
    removeRole: b.mutation<unknown, AddRoleParams>({
      query: (params) => ({ url: '/Role/remove-role-from-user', method: 'DELETE', params }),
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
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAddRoleMutation,
  useRemoveRoleMutation,
  useAddUserMutation,
} = usersApi
