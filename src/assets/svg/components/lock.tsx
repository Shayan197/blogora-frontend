import React from 'react';

type IconProps = {
    size?: number | string; // icon size (px, rem etc.)
    color?: string; // icon color
    className?: string; // extra tailwind/custom classes
};

const LockIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={className}
        >
            <g fill="none">
                <path
                    fill={color}
                    fillOpacity="0.25"
                    d="M4 12c0-.943 0-1.414.293-1.707S5.057 10 6 10h12c.943 0 1.414 0 1.707.293S20 11.057 20 12v6.038c0 .38 0 .571-.029.74a2 2 0 0 1-1.164 1.49c-.156.07-.341.116-.71.208c-1.238.31-1.857.464-2.476.578c-2.394.44-4.848.44-7.243 0c-.618-.114-1.237-.269-2.474-.578c-.37-.092-.555-.139-.71-.207a2 2 0 0 1-1.165-1.492C4 18.61 4 18.42 4 18.037z"
                />
                <path stroke={color} d="M16.5 10V9a4.5 4.5 0 0 0-9 0v1" strokeWidth="1" />
                <circle cx="12" cy="15" r="2" fill={color} />
                <path stroke={color} strokeLinecap="round" d="M12 16v2.5" strokeWidth="1" />
            </g>
        </svg>
    );
};

export default LockIcon;
