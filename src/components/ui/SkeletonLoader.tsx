import React from 'react';

interface SkeletonProps {
    type?: 'card' | 'story' | 'feed' | 'profile' | 'trending';
    count?: number;
}

export const SkeletonLoader = ({ type = 'card', count = 1 }: SkeletonProps): React.JSX.Element => {
    const items = Array.from({ length: count }, (_, i) => i);

    if (type === 'trending') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((i) => (
                    <div key={i} className="flex items-start gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-subtle)]" />
                        <div className="flex-1 space-y-2">
                            <div className="w-24 h-3 bg-[var(--bg-surface-subtle)] rounded-full" />
                            <div className="w-full h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                            <div className="w-2/3 h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                            <div className="w-20 h-3 bg-[var(--bg-surface-subtle)] rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'feed') {
        return (
            <div className="space-y-6">
                {items.map((i) => (
                    <div
                        key={i}
                        className="py-6 border-b border-[var(--border-subtle)] animate-pulse flex flex-col sm:flex-row gap-6"
                    >
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[var(--bg-surface-subtle)]" />
                                <div className="w-28 h-3 bg-[var(--bg-surface-subtle)] rounded-full" />
                            </div>
                            <div className="w-3/4 h-6 bg-[var(--bg-surface-subtle)] rounded-lg" />
                            <div className="w-full h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                            <div className="w-1/2 h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                            <div className="flex gap-3 pt-2">
                                <div className="w-16 h-6 bg-[var(--bg-surface-subtle)] rounded-full" />
                                <div className="w-20 h-6 bg-[var(--bg-surface-subtle)] rounded-full" />
                            </div>
                        </div>
                        <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-[var(--bg-surface-subtle)] rounded-2xl flex-shrink-0" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'story') {
        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
                <div className="w-28 h-6 bg-[var(--bg-surface-subtle)] rounded-full" />
                <div className="w-full h-12 bg-[var(--bg-surface-subtle)] rounded-2xl" />
                <div className="w-3/4 h-8 bg-[var(--bg-surface-subtle)] rounded-xl" />
                <div className="flex items-center gap-4 py-4 border-y border-[var(--border-subtle)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-subtle)]" />
                    <div className="space-y-2">
                        <div className="w-36 h-4 bg-[var(--bg-surface-subtle)] rounded-full" />
                        <div className="w-24 h-3 bg-[var(--bg-surface-subtle)] rounded-full" />
                    </div>
                </div>
                <div className="w-full aspect-video rounded-3xl bg-[var(--bg-surface-subtle)]" />
                <div className="space-y-4 pt-4">
                    <div className="w-full h-4 bg-[var(--bg-surface-subtle)] rounded" />
                    <div className="w-full h-4 bg-[var(--bg-surface-subtle)] rounded" />
                    <div className="w-5/6 h-4 bg-[var(--bg-surface-subtle)] rounded" />
                    <div className="w-4/5 h-4 bg-[var(--bg-surface-subtle)] rounded" />
                </div>
            </div>
        );
    }

    // Default card
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((i) => (
                <div key={i} className="card-editorial p-6 space-y-4 animate-pulse">
                    <div className="w-full aspect-video bg-[var(--bg-surface-subtle)] rounded-xl" />
                    <div className="w-24 h-3 bg-[var(--bg-surface-subtle)] rounded-full" />
                    <div className="w-full h-5 bg-[var(--bg-surface-subtle)] rounded-md" />
                    <div className="w-4/5 h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                    <div className="w-full h-3 bg-[var(--bg-surface-subtle)] rounded-full pt-2" />
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
