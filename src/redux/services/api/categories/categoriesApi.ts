import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type {
    Blog,
    Category,
    CreateCategoryPayload,
    PaginatedResponse,
    UpdateCategoryPayload,
} from '@/types/blog';

type CategoryListResponse = ResponseType<{ categories: Category[] }>;
type SingleCategoryResponse = ResponseType<{
    category: Category;
    blogs: PaginatedResponse<Blog>;
}>;
type CategoryMutationResponse = ResponseType<{ category: Category }>;
type MessageResponse = ResponseType<null>;

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listCategories: builder.query<CategoryListResponse, { includeInactive?: boolean } | void>({
            query: (params) => {
                const query = params?.includeInactive ? '?includeInactive=true' : '';
                return `/categories${query}`;
            },
            providesTags: [{ type: 'Categories', id: 'LIST' }],
        }),

        getCategoryBySlug: builder.query<
            SingleCategoryResponse,
            { slug: string; page?: number; limit?: number }
        >({
            query: ({ slug, page = 1, limit = 10 }) =>
                `/categories/${slug}?page=${page}&limit=${limit}`,
            providesTags: (_result, _error, { slug }) => [{ type: 'Categories', id: slug }],
        }),

        createCategory: builder.mutation<CategoryMutationResponse, CreateCategoryPayload>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
        }),

        updateCategory: builder.mutation<
            CategoryMutationResponse,
            { uuid: string; data: UpdateCategoryPayload }
        >({
            query: ({ uuid, data }) => ({
                url: `/categories/${uuid}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
        }),

        deleteCategory: builder.mutation<MessageResponse, string>({
            query: (uuid) => ({
                url: `/categories/${uuid}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useListCategoriesQuery,
    useGetCategoryBySlugQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
