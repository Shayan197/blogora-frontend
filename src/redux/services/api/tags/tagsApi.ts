import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type {
    Blog,
    CreateTagPayload,
    PaginatedResponse,
    Tag,
    UpdateTagPayload,
} from '@/types/blog';

type TagListResponse = ResponseType<PaginatedResponse<Tag>>;
type SingleTagResponse = ResponseType<{
    tag: Tag;
    blogs: PaginatedResponse<Blog>;
}>;
type TagMutationResponse = ResponseType<{ tag: Tag }>;
type MessageResponse = ResponseType<null>;

export const tagsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listTags: builder.query<
            TagListResponse,
            { search?: string; page?: number; limit?: number } | void
        >({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params?.search) searchParams.set('search', params.search);
                if (params?.page) searchParams.set('page', String(params.page));
                if (params?.limit) searchParams.set('limit', String(params.limit));
                const query = searchParams.toString();
                return `/tags${query ? `?${query}` : ''}`;
            },
            providesTags: [{ type: 'Tags', id: 'LIST' }],
        }),

        getTagBySlug: builder.query<
            SingleTagResponse,
            { slug: string; page?: number; limit?: number }
        >({
            query: ({ slug, page = 1, limit = 10 }) => `/tags/${slug}?page=${page}&limit=${limit}`,
            providesTags: (_result, _error, { slug }) => [{ type: 'Tags', id: slug }],
        }),

        createTag: builder.mutation<TagMutationResponse, CreateTagPayload>({
            query: (body) => ({
                url: '/tags',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
        }),

        updateTag: builder.mutation<TagMutationResponse, { uuid: string; data: UpdateTagPayload }>({
            query: ({ uuid, data }) => ({
                url: `/tags/${uuid}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
        }),

        deleteTag: builder.mutation<MessageResponse, string>({
            query: (uuid) => ({
                url: `/tags/${uuid}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useListTagsQuery,
    useGetTagBySlugQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = tagsApi;
