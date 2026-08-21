'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiBookOpen, FiTag, FiFolder, FiArrowRight } from 'react-icons/fi';
import { useListBlogsQuery } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useListTagsQuery } from '@/redux/services/api/tags/tagsApi';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps): React.JSX.Element | null => {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { data: blogsData, isFetching: isBlogsLoading } = useListBlogsQuery(
        { search: searchQuery, limit: 5 },
        { skip: !searchQuery.trim() },
    );
    const { data: categoriesData } = useListCategoriesQuery(undefined, { skip: !isOpen });
    const { data: tagsData } = useListTagsQuery(
        { search: searchQuery, limit: 6 },
        { skip: !isOpen },
    );

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // Defer state update to avoid calling setState synchronously inside an effect
            setTimeout(() => setSearchQuery(''), 0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) onClose();
                else {
                    // Open triggered from parent or global listener
                }
            } else if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const blogs = blogsData?.data?.items ?? [];
    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    const handleSelectStory = (slug: string) => {
        onClose();
        router.push(`/story/${slug}`);
    };

    const handleSelectCategory = (slug: string) => {
        onClose();
        router.push(`/category/${slug}`);
    };

    const handleSelectTag = (slug: string) => {
        onClose();
        router.push(`/tag/${slug}`);
    };

    const handleViewAllResults = () => {
        onClose();
        router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
            <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 divide-y divide-[var(--border-subtle)]">
                {/* Search Header Bar */}
                <div className="flex items-center px-6 py-4 gap-3">
                    <FiSearch className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stories, topics, tags, or concepts..."
                        className="w-full text-base bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:inline px-2 py-1 text-[10px] bg-[var(--bg-surface-subtle)] rounded border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        ESC
                    </kbd>
                </div>

                {/* Results Body */}
                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                    {/* Story Matches */}
                    {searchQuery.trim() && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                                    <FiBookOpen className="w-3.5 h-3.5" />
                                    <span>Stories</span>
                                </h4>
                                {blogs.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleViewAllResults}
                                        className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                                    >
                                        <span>View all</span>
                                        <FiArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {isBlogsLoading ? (
                                <div className="py-4 text-center text-xs text-[var(--text-muted)]">
                                    Searching stories...
                                </div>
                            ) : blogs.length === 0 ? (
                                <p className="text-xs text-[var(--text-muted)] py-2">
                                    No stories matched &ldquo;{searchQuery}&rdquo;.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {blogs.map((b) => (
                                        <div
                                            key={b.uuid}
                                            onClick={() => handleSelectStory(b.slug)}
                                            className="p-3 rounded-2xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-primary-subtle)] border border-transparent hover:border-[var(--accent-primary)]/30 transition-all cursor-pointer group"
                                        >
                                            <h5 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] line-clamp-1">
                                                {b.title}
                                            </h5>
                                            {b.subtitle && (
                                                <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                                                    {b.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Popular Topics */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                            <FiFolder className="w-3.5 h-3.5" />
                            <span>Categories & Topics</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 8).map((c) => (
                                <button
                                    key={c.uuid}
                                    type="button"
                                    onClick={() => handleSelectCategory(c.slug)}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white border border-[var(--border-subtle)] transition-colors"
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                                <FiTag className="w-3.5 h-3.5" />
                                <span>Related Tags</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t) => (
                                    <button
                                        key={t.uuid}
                                        type="button"
                                        onClick={() => handleSelectTag(t.slug)}
                                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                                    >
                                        #{t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Hint */}
                <div className="px-6 py-3 bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>Protip: Navigate with ⌘K / Ctrl+K anytime</span>
                    <Link
                        href="/explore"
                        onClick={onClose}
                        className="text-[var(--accent-primary)] font-semibold hover:underline"
                    >
                        Go to Advanced Explore
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
