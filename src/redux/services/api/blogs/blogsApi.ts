import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type {
    Blog,
    BlogFeedQuery,
    CreateBlogPayload,
    PaginatedResponse,
    UpdateBlogPayload,
    UserListItem,
} from '@/types/blog';

type BlogListResponse = ResponseType<PaginatedResponse<Blog>>;
type TrendingBlogsResponse = ResponseType<{ blogs: Blog[] }>;
type SingleBlogResponse = ResponseType<{ blog: Blog; isLikedByMe?: boolean }>;
type BlogMutationResponse = ResponseType<{ blog: Blog }>;
type ToggleLikeResponse = ResponseType<{ liked: boolean; likesCount: number }>;
type LikersResponse = ResponseType<PaginatedResponse<UserListItem>>;
type StatusToggleResponse = ResponseType<{ status: string; publishedAt: string | null }>;
type MessageResponse = ResponseType<null>;

export const blogsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listBlogs: builder.query<BlogListResponse, BlogFeedQuery | void>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    if (params.page) searchParams.set('page', String(params.page));
                    if (params.limit) searchParams.set('limit', String(params.limit));
                    if (params.category) searchParams.set('category', params.category);
                    if (params.tag) searchParams.set('tag', params.tag);
                    if (params.author) searchParams.set('author', params.author);
                    if (params.search) searchParams.set('search', params.search);
                    if (params.featured) searchParams.set('featured', params.featured);
                    if (params.sort) searchParams.set('sort', params.sort);
                }
                const queryString = searchParams.toString();
                return `/blogs${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                          ...result.data.items.map(({ uuid }) => ({
                              type: 'Blogs' as const,
                              id: uuid,
                          })),
                          { type: 'Blogs', id: 'LIST' },
                      ]
                    : [{ type: 'Blogs', id: 'LIST' }],
        }),

        getTrendingBlogs: builder.query<TrendingBlogsResponse, void>({
            query: () => '/blogs/trending',
            providesTags: [{ type: 'TrendingBlogs', id: 'LIST' }],
        }),

        getBlogBySlug: builder.query<SingleBlogResponse, string>({
            query: (slugOrUuid) => `/blogs/${slugOrUuid}`,
            providesTags: (_result, _err, slugOrUuid) => [{ type: 'SingleBlog', id: slugOrUuid }],
        }),

        getMyBlogs: builder.query<
            BlogListResponse,
            { page?: number; limit?: number; status?: string } | void
        >({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params?.page) searchParams.set('page', String(params.page));
                if (params?.limit) searchParams.set('limit', String(params.limit));
                if (params?.status) searchParams.set('status', params.status);
                const query = searchParams.toString();
                return `/blogs/me${query ? `?${query}` : ''}`;
            },
            providesTags: [{ type: 'MyBlogs', id: 'LIST' }],
        }),

        createBlog: builder.mutation<BlogMutationResponse, CreateBlogPayload>({
            query: (body) => ({
                url: '/blogs',
                method: 'POST',
                body,
            }),
            invalidatesTags: [
                { type: 'Blogs', id: 'LIST' },
                { type: 'TrendingBlogs', id: 'LIST' },
                { type: 'MyBlogs', id: 'LIST' },
                { type: 'Categories', id: 'LIST' },
                { type: 'Tags', id: 'LIST' },
            ],
        }),

        updateBlog: builder.mutation<
            BlogMutationResponse,
            { uuid: string; data: UpdateBlogPayload }
        >({
            query: ({ uuid, data }) => ({
                url: `/blogs/${uuid}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { uuid }) => [
                { type: 'Blogs', id: 'LIST' },
                { type: 'Blogs', id: uuid },
                { type: 'SingleBlog', id: uuid },
                { type: 'MyBlogs', id: 'LIST' },
                { type: 'TrendingBlogs', id: 'LIST' },
            ],
        }),

        deleteBlog: builder.mutation<MessageResponse, string>({
            query: (uuid) => ({
                url: `/blogs/${uuid}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Blogs', id: 'LIST' },
                { type: 'MyBlogs', id: 'LIST' },
                { type: 'TrendingBlogs', id: 'LIST' },
            ],
        }),

        togglePublishStatus: builder.mutation<StatusToggleResponse, string>({
            query: (uuid) => ({
                url: `/blogs/${uuid}/publish`,
                method: 'PATCH',
            }),
            invalidatesTags: (_result, _error, uuid) => [
                { type: 'Blogs', id: 'LIST' },
                { type: 'Blogs', id: uuid },
                { type: 'SingleBlog', id: uuid },
                { type: 'MyBlogs', id: 'LIST' },
                { type: 'TrendingBlogs', id: 'LIST' },
            ],
        }),

        toggleLike: builder.mutation<ToggleLikeResponse, string>({
            query: (blogUuid) => ({
                url: `/blogs/${blogUuid}/likes`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, blogUuid) => [
                { type: 'SingleBlog', id: blogUuid },
                { type: 'Blogs', id: 'LIST' },
                { type: 'TrendingBlogs', id: 'LIST' },
            ],
        }),

        getBlogLikers: builder.query<
            LikersResponse,
            { blogUuid: string; page?: number; limit?: number }
        >({
            query: ({ blogUuid, page = 1, limit = 20 }) =>
                `/blogs/${blogUuid}/likes?page=${page}&limit=${limit}`,
        }),
    }),
    overrideExisting: true,
});

export const {
    useListBlogsQuery,
    useGetTrendingBlogsQuery,
    useGetBlogBySlugQuery,
    useGetMyBlogsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useTogglePublishStatusMutation,
    useToggleLikeMutation,
    useGetBlogLikersQuery,
} = blogsApi;
