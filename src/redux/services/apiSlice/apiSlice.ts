import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@/types/auth';
import { baseQueryWithReauth } from './baseQuery';

// ===========================================================
//                          Types
// ===========================================================
export type ResponseType<T = unknown> = ApiResponse<T>;

// ===========================================================
//                          Slice
// ===========================================================

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'UserProfile',
        'Blogs',
        'TrendingBlogs',
        'MyBlogs',
        'SingleBlog',
        'Categories',
        'Tags',
        'Comments',
        'Notifications',
        'UsersList',
    ],
    endpoints: () => ({}),
});
