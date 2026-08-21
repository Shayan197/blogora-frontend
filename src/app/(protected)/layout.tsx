'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useAppSelector } from '@/redux/hooks';

const ProtectedLayout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
    const router = useRouter();
    const hasMounted = useHasMounted();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isAuthInitialized = useAppSelector((state) => state.auth.isAuthInitialized);
    const isSessionExpired = useAppSelector((state) => state.auth.isSessionExpired);

    useEffect(() => {
        if (!hasMounted) return;
        if (!isAuthInitialized) return;

        if (isSessionExpired) {
            router.replace('/login?sessionExpired=true');
            return;
        }

        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [hasMounted, isAuthInitialized, isAuthenticated, isSessionExpired, router]);

    if (!hasMounted || !isAuthInitialized || !isAuthenticated || isSessionExpired) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <div className="protected-layout">{children}</div>;
};

export default ProtectedLayout;
