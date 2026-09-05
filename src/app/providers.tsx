'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux';
import { completeAuthBootstrap, login } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { authApi } from '@/redux/services/api/auth/auth';

type ProvidersProps = {
    children: ReactNode;
};

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let isMounted = true;

        const bootstrapAuth = async () => {
            try {
                const meResult = await dispatch(authApi.endpoints.getMe.initiate()).unwrap();
                if (isMounted && meResult?.data) {
                    dispatch(
                        login({ accessToken: 'cookie-session', refreshToken: 'cookie-session' }),
                    );
                }
            } catch {
                // If getMe fails after refresh attempt, user remains unauthenticated
            } finally {
                if (isMounted) {
                    dispatch(completeAuthBootstrap());
                }
            }
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
