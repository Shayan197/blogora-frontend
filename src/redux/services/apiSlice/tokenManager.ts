// tokenManager.ts
import { BaseQueryApi } from '@reduxjs/toolkit/query';
import { expireSession, setAccRefTokens } from '@/redux/features/authSlice';
import { authTokenStorage } from '@/utils/authStorage.util';
import getFreshToken from '@/utils/token.util';

// This is a token manager that handles the token refreshing logic.
// It refresh the token and update the secure store and states accordingly.
// If the refresh token is also expired then it will clear the tokens from secure store and you will get the 401 error in api. Now you can safely expire the user session. to reauthenticate him.
// This is also capable of handling the race conditions, means if multiple requests are made at the same time and the token is expired, it will only refresh the token once and all the requests will wait for the new token to be set before proceeding with their original queries.
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const tokenManager = {
    async refreshToken(api: BaseQueryApi): Promise<boolean> {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = (async () => {
                try {
                    const response = await getFreshToken();
                    if (response.error) {
                        if (response.error !== 'FETCH_ERROR') {
                            authTokenStorage.clearTokens();
                            api.dispatch(expireSession());
                        }
                        return false;
                    }

                    const accessToken = response.data?.accessToken ?? 'cookie-session';
                    const refreshToken = response.data?.refreshToken ?? 'cookie-session';

                    authTokenStorage.setTokens({ accessToken, refreshToken });
                    api.dispatch(
                        setAccRefTokens({
                            accessToken,
                            refreshToken,
                        }),
                    );
                    return true;
                } catch {
                    authTokenStorage.clearTokens();
                    api.dispatch(expireSession());
                    return false;
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            })();
        }
        return refreshPromise!;
    },
};
