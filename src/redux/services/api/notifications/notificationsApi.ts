import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type { Notification, PaginatedResponse } from '@/types/blog';

type NotificationsResponse = ResponseType<
    PaginatedResponse<Notification> & { unreadCount: number }
>;
type MessageResponse = ResponseType<null>;

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            NotificationsResponse,
            { page?: number; limit?: number } | void
        >({
            query: (params) => {
                const page = params?.page ?? 1;
                const limit = params?.limit ?? 15;
                return `/notifications?page=${page}&limit=${limit}`;
            },
            providesTags: [{ type: 'Notifications', id: 'LIST' }],
        }),

        markAsRead: builder.mutation<MessageResponse, string>({
            query: (uuid) => ({
                url: `/notifications/${uuid}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
        }),

        markAllAsRead: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: '/notifications/read-all',
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
        }),

        deleteNotification: builder.mutation<MessageResponse, string>({
            query: (uuid) => ({
                url: `/notifications/${uuid}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
} = notificationsApi;
