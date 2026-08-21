import { useEffect, useState } from 'react';

export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setHasMounted(true), 0);
        return () => window.clearTimeout(timer);
    }, []);

    return hasMounted;
};
