import {
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/constants/config';
import { RootState } from '@/redux';
import PUBLIC_ENDPOINTS from '@/redux/services/apiSlice/publishEndpoints';
import { tokenManager } from '@/redux/services/apiSlice/tokenManager';
import handleResponseTransformation from '@/utils/responseTranformer';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState() as RootState;
        const token = state.auth.accessToken;
        if (token && !PUBLIC_ENDPOINTS.includes(endpoint)) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Skip processing for public endpoints and non-401 errors
    if (result.error?.status === 401 && !PUBLIC_ENDPOINTS.includes(api.endpoint)) {
        const refreshedAccessToken = await tokenManager.refreshToken(api);

        if (refreshedAccessToken) {
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return handleResponseTransformation(result);
};
