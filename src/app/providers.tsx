'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux';
import { completeAuthBootstrap, login } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { authTokenStorage } from '@/utils/authStorage.util';
import getFreshToken, { verifyAccessTokenExpiry } from '@/utils/token.util';

type ProvidersProps = {
    children: ReactNode;
};

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let isMounted = true;

        const bootstrapAuth = async () => {
            const accessToken = authTokenStorage.getAccessToken();
            const refreshToken = authTokenStorage.getRefreshToken();

            if (accessToken && refreshToken && verifyAccessTokenExpiry(accessToken) > 30) {
                const tokens = { accessToken, refreshToken };
                authTokenStorage.setTokens(tokens);
                dispatch(login(tokens));
                return;
            }

            if (!refreshToken) {
                authTokenStorage.clearTokens();
                dispatch(completeAuthBootstrap());
                return;
            }

            const response = await getFreshToken(refreshToken);
            if (!isMounted) return;

            if (response.data?.accessToken && response.data.refreshToken) {
                authTokenStorage.setTokens(response.data);
                dispatch(login(response.data));
                return;
            }

            if (response.error !== 'FETCH_ERROR') {
                authTokenStorage.clearTokens();
            }

            dispatch(completeAuthBootstrap());
        };

        void bootstrapAuth();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return <>{children}</>;
};

const Providers = ({ children }: ProvidersProps) => {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
                <AuthBootstrap>{children}</AuthBootstrap>
            </ThemeProvider>
        </Provider>
    );
};

export default Providers;
