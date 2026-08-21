'use client';

import Link from 'next/link';
import React from 'react';

type RedirectProps = {
    text: string;
    linkText: string;
    linkTo: string;
};

const Redirect = ({ text, linkText, linkTo }: RedirectProps): React.JSX.Element => {
    return (
        <p className="text-xs text-center text-[var(--text-secondary)] mt-3">
            {text}{' '}
            <Link
                href={linkTo}
                className="text-[var(--accent-primary)] font-semibold hover:underline"
            >
                {linkText}
            </Link>
        </p>
    );
};

export default Redirect;
