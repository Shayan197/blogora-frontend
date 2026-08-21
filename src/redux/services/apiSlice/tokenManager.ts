// tokenManager.ts
import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { RootState } from '@/redux';
import { expireSession, setAccRefTokens } from '@/redux/features/authSlice';
import { authTokenStorage } from '@/utils/authStorage.util';
import getFreshToken from '@/utils/token.util';

// This is a token manager that handles the token refreshing logic.
// It refresh the token and update the secure store and states accordingly.
// If the refresh token is also expired then it will clear the tokens from secure store and you will get the 401 error in api. Now you can safely expire the user session. to reauthenticate him.
// This is also capable of handling the race conditions, means if multiple requests are made at the same time and the token is expired, it will only refresh the token once and all the requests will wait for the new token to be set before proceeding with their original queries.
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
export const tokenManager = {
    async refreshToken(api: BaseQueryApi): Promise<string | null> {
        if (!isRefreshing) {
            isRefreshing = true;
            // api.dispatch(startRefreshing());
            refreshPromise = (async () => {
                try {
                    const state = api.getState() as RootState;
                    const currentRefreshToken =
                        state.auth.refreshToken ?? authTokenStorage.getRefreshToken();

                    if (!currentRefreshToken) {
                        authTokenStorage.clearTokens();
                        api.dispatch(expireSession());
                        return null;
                    }

                    const response = await getFreshToken(currentRefreshToken);
                    if (response.error) {
                        if (response.error !== 'FETCH_ERROR') {
                            authTokenStorage.clearTokens();
                            api.dispatch(expireSession());
                        }
                        return null;
                    }

                    const accessToken = response.data?.accessToken;
                    const refreshToken = response.data?.refreshToken;
                    if (!accessToken || !refreshToken) {
                        authTokenStorage.clearTokens();
                        api.dispatch(expireSession());
                        return null;
                    }

                    authTokenStorage.setTokens({ accessToken, refreshToken });
                    api.dispatch(
                        setAccRefTokens({
                            accessToken,
                            refreshToken,
                        }),
                    );
                    return accessToken;
                } catch {
                    authTokenStorage.clearTokens();
                    api.dispatch(expireSession());
                    return null;
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            })();
        }
        return refreshPromise!;
    },
};
