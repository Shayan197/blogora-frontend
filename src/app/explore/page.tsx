'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import {
    FiSearch,
    FiFilter,
    FiTrendingUp,
    FiClock,
    FiStar,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import TopicPill from '@/components/ui/TopicPill';
import { useListBlogsQuery } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useListTagsQuery } from '@/redux/services/api/tags/tagsApi';

const ExploreContent = (): React.JSX.Element => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') ?? '';
    const initialCategory = searchParams.get('category') ?? '';
    const initialTag = searchParams.get('tag') ?? '';
    const initialSort = (searchParams.get('sort') as 'latest' | 'popular' | 'top') ?? 'latest';

    const [search, setSearch] = useState(initialSearch);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
        initialCategory || undefined,
    );
    const [selectedTag, setSelectedTag] = useState<string | undefined>(initialTag || undefined);
    const [sort, setSort] = useState<'latest' | 'popular' | 'top'>(initialSort);
    const [page, setPage] = useState(1);

    const {
        data: blogsData,
        isLoading,
        isFetching,
    } = useListBlogsQuery({
        page,
        limit: 9,
        search: searchTerm || undefined,
        category: selectedCategory,
        tag: selectedTag,
        sort,
    });

    const { data: categoriesData } = useListCategoriesQuery();
    const { data: tagsData } = useListTagsQuery({ limit: 15 });

    const blogs = blogsData?.data?.items ?? [];
    const pagination = blogsData?.data?.pagination;
    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(search);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSearchTerm('');
        setSelectedCategory(undefined);
        setSelectedTag(undefined);
        setSort('latest');
        setPage(1);
    };

    const hasActiveFilters = !!(searchTerm || selectedCategory || selectedTag || sort !== 'latest');

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
                {/* Header & Search Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        Explore Stories & Ideas
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                        Search across topics, tags, and articles written by industry practitioners.
                    </p>

                    {/* Search Input Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by keywords, titles, or concepts..."
                            className="w-full pl-12 pr-28 py-3.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 shadow-md text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all outline-none"
                        />
                        <FiSearch className="absolute left-4 top-5.5 w-5 h-5 text-[var(--text-muted)]" />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors shadow-sm"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Categories Bar */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                            <FiFilter className="w-3.5 h-3.5" />
                            <span>Filter by Category</span>
                        </span>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-xs font-semibold text-rose-500 hover:underline"
                            >
                                Reset all filters
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <TopicPill
                                key={c.uuid}
                                name={c.name}
                                slug={c.slug}
                                count={c.blogsCount}
                                color={c.color}
                                isActive={selectedCategory === c.slug}
                                onClick={() => {
                                    setSelectedCategory(
                                        selectedCategory === c.slug ? undefined : c.slug,
                                    );
                                    setPage(1);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Tags Bar */}
                {tags.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] block">
                            Popular Tags
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((t) => (
                                <button
                                    key={t.uuid}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTag(selectedTag === t.slug ? undefined : t.slug);
                                        setPage(1);
                                    }}
                                    className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors border ${
                                        selectedTag === t.slug
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-blue-400'
                                    }`}
                                >
                                    #{t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sort Bar & Total Items */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                    <p className="text-xs font-medium text-[var(--text-muted)]">
                        {pagination
                            ? `Showing ${blogs.length} of ${pagination.totalItems} stories`
                            : 'Loading stories...'}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)] font-medium">
                            Sort by:
                        </span>
                        <div className="inline-flex rounded-xl bg-[var(--bg-surface-subtle)] p-1 border border-[var(--border-subtle)] text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('latest');
                                    setPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                                    sort === 'latest'
                                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <FiClock className="w-3.5 h-3.5" />
                                <span>Latest</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('popular');
                                    setPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                                    sort === 'popular'
                                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <FiTrendingUp className="w-3.5 h-3.5" />
                                <span>Views</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('top');
                                    setPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                                    sort === 'top'
                                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                <FiStar className="w-3.5 h-3.5" />
                                <span>Claps</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                {isLoading || isFetching ? (
                    <SkeletonLoader type="card" count={6} />
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-3">
                        <FiSearch className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                            No stories found matching your criteria
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                            Try resetting filters or searching with different keywords.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-2 px-5 py-2 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors shadow-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {blogs.map((b) => (
                            <StoryCard key={b.uuid} blog={b} layout="grid" />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-10 border-t border-[var(--border-subtle)]">
                        <button
                            type="button"
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40 transition-colors cursor-pointer"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        <span className="text-xs font-medium text-[var(--text-muted)]">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={!pagination.hasNextPage}
                            onClick={() => setPage((p) => p + 1)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40 transition-colors cursor-pointer"
                        >
                            <span>Next</span>
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

const ExplorePage = (): React.JSX.Element => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    Loading Explore...
                </div>
            }
        >
            <ExploreContent />
        </Suspense>
    );
};

export default ExplorePage;
