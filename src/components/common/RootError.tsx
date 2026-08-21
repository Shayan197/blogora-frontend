'use client';

import React from 'react';
import type { FieldError } from 'react-hook-form';

type RootErr = {
    error?: FieldError | { message?: string };
};

const RootError = ({ error }: RootErr): React.JSX.Element => {
    return (
        <div className="min-h-6">
            {error?.message && <span className="text-red-400 text-xs mt-2">{error.message}</span>}
        </div>
    );
};

export default RootError;
