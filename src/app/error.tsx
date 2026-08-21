'use client';

import { useEffect } from 'react';

export const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        globalThis.reportError?.(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2>Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
};
export default Error;
