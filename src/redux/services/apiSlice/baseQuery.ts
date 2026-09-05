import {
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/constants/config';
import PUBLIC_ENDPOINTS from '@/redux/services/apiSlice/publicEndpoints';
import { tokenManager } from '@/redux/services/apiSlice/tokenManager';
import handleResponseTransformation from '@/utils/responseTranformer';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Skip processing for public endpoints and non-401 errors
    if (result.error?.status === 401 && !PUBLIC_ENDPOINTS.includes(api.endpoint)) {
        const isRefreshedAccessToken = await tokenManager.refreshToken(api);

        if (isRefreshedAccessToken) {
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return handleResponseTransformation(result);
};
