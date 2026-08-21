import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '@/types/blog';

type CommentsListResponse = ResponseType<{ comments: Comment[] }>;
type CommentMutationResponse = ResponseType<{ comment: Comment }>;
type MessageResponse = ResponseType<null>;

export const commentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogComments: builder.query<CommentsListResponse, string>({
            query: (blogUuid) => `/comments/blog/${blogUuid}`,
            providesTags: (_result, _error, blogUuid) => [{ type: 'Comments', id: blogUuid }],
        }),

        createComment: builder.mutation<
            CommentMutationResponse,
            { blogUuid: string; data: CreateCommentPayload }
        >({
            query: ({ blogUuid, data }) => ({
                url: `/comments/blog/${blogUuid}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { blogUuid }) => [
                { type: 'Comments', id: blogUuid },
                { type: 'SingleBlog', id: blogUuid },
                { type: 'Blogs', id: 'LIST' },
            ],
        }),

        updateComment: builder.mutation<
            CommentMutationResponse,
            { uuid: string; data: UpdateCommentPayload; blogUuid?: string }
        >({
            query: ({ uuid, data }) => ({
                url: `/comments/${uuid}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { blogUuid }) =>
                blogUuid
                    ? [{ type: 'Comments', id: blogUuid }]
                    : [{ type: 'Comments', id: 'LIST' }],
        }),

        deleteComment: builder.mutation<MessageResponse, { uuid: string; blogUuid?: string }>({
            query: ({ uuid }) => ({
                url: `/comments/${uuid}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { blogUuid }) => [
                ...(blogUuid
                    ? [
                          { type: 'Comments' as const, id: blogUuid },
                          { type: 'SingleBlog' as const, id: blogUuid },
                      ]
                    : []),
                { type: 'Blogs' as const, id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetBlogCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
