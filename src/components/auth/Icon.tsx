import React from 'react';
import LockIcon from '@/assets/svg/components/lock';

const Icon = () => {
    return (
        <div className="flex justify-center mb-6">
            <div className="text-center bg-customJamni size-16 flex justify-center items-center rounded-full ">
                <LockIcon color="white" size={48} />
            </div>
        </div>
    );
};

export default Icon;
