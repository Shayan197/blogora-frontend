import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type {
    PaginatedResponse,
    Role,
    UpdateUserRolePayload,
    UpdateUserStatusPayload,
    UserListItem,
} from '@/types/blog';

type UsersListResponse = ResponseType<PaginatedResponse<UserListItem>>;
type SingleUserResponse = ResponseType<{ user: UserListItem }>;
type RolesListResponse = ResponseType<{ roles: Role[] }>;
type MessageResponse = ResponseType<null>;

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listUsers: builder.query<
            UsersListResponse,
            {
                page?: number;
                limit?: number;
                roleId?: string;
                status?: string;
                search?: string;
            } | void
        >({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params?.page) searchParams.set('page', String(params.page));
                if (params?.limit) searchParams.set('limit', String(params.limit));
                if (params?.roleId) searchParams.set('roleId', params.roleId);
                if (params?.status) searchParams.set('status', params.status);
                if (params?.search) searchParams.set('search', params.search);
                const query = searchParams.toString();
                return `/users${query ? `?${query}` : ''}`;
            },
            providesTags: [{ type: 'UsersList', id: 'LIST' }],
        }),

        listRoles: builder.query<RolesListResponse, void>({
            query: () => '/users/roles',
        }),

        getUserByUuid: builder.query<SingleUserResponse, string>({
            query: (uuid) => `/users/${uuid}`,
        }),

        updateUserRole: builder.mutation<
            MessageResponse,
            { uuid: string; data: UpdateUserRolePayload }
        >({
            query: ({ uuid, data }) => ({
                url: `/users/${uuid}/role`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'UsersList', id: 'LIST' }],
        }),

        updateUserStatus: builder.mutation<
            MessageResponse,
            { uuid: string; data: UpdateUserStatusPayload }
        >({
            query: ({ uuid, data }) => ({
                url: `/users/${uuid}/status`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'UsersList', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useListUsersQuery,
    useListRolesQuery,
    useGetUserByUuidQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
} = usersApi;
