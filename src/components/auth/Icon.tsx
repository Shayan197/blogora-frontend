import React from 'react';
import LockIcon from '@/assets/svg/components/lock';

const Icon = () => {
    return (
        <div className="flex justify-center mb-6">
            <div className="text-center bg-[var(--accent-primary)] text-white size-16 flex justify-center items-center rounded-2xl shadow-lg shadow-[var(--accent-primary)]/25 ring-4 ring-[var(--accent-primary)]/10 transition-all duration-300">
                <LockIcon color="currentColor" size={40} />
            </div>
        </div>
    );
};

export default Icon;
