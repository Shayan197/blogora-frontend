'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useAppSelector } from '@/redux/hooks';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const hasMounted = useHasMounted();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isAuthInitialized = useAppSelector((state) => state.auth.isAuthInitialized);
    const isSessionExpired = useAppSelector((state) => state.auth.isSessionExpired);

    useEffect(() => {
        if (!hasMounted) return;

        if (isAuthInitialized && isAuthenticated && !isSessionExpired) {
            router.replace('/homepage');
        }
    }, [hasMounted, isAuthInitialized, isAuthenticated, isSessionExpired, router]);

    if (!hasMounted || !isAuthInitialized || (isAuthenticated && !isSessionExpired)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
