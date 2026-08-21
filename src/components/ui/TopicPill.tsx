'use client';

import Link from 'next/link';
import React from 'react';

interface TopicPillProps {
    name: string;
    slug: string;
    count?: number;
    isActive?: boolean;
    onClick?: () => void;
    color?: string | null;
}

export const TopicPill = ({
    name,
    slug,
    count,
    isActive = false,
    onClick,
    color,
}: TopicPillProps): React.JSX.Element => {
    const pillContent = (
        <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                isActive
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-sm shadow-blue-500/20'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
            }`}
        >
            {color && (
                <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                />
            )}
            <span>{name}</span>
            {typeof count === 'number' && (
                <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                    }`}
                >
                    {count}
                </span>
            )}
        </span>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className="focus:outline-none">
                {pillContent}
            </button>
        );
    }

    return (
        <Link href={`/category/${slug}`} className="focus:outline-none inline-block">
            {pillContent}
        </Link>
    );
};

export default TopicPill;
