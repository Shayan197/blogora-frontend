import Link from 'next/link';
import React from 'react';
import { FiInbox, FiEdit3 } from 'react-icons/fi';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ElementType;
}

export const EmptyState = ({
    title = 'No stories found',
    description = 'Try adjusting your search or filters to explore more content.',
    actionLabel = 'Write a Story',
    actionHref = '/publish',
    icon: Icon = FiInbox,
}: EmptyStateProps): React.JSX.Element => {
    return (
        <div className="text-center py-16 px-6 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-4 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-sm">
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <h4 className="text-lg font-bold text-[var(--text-primary)]">{title}</h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
            {actionLabel && actionHref && (
                <div className="pt-2">
                    <Link
                        href={actionHref}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-all shadow-sm shadow-blue-500/20"
                    >
                        <FiEdit3 className="w-4 h-4" />
                        <span>{actionLabel}</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
