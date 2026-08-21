'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { FiTag, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import { useGetTagBySlugQuery } from '@/redux/services/api/tags/tagsApi';

export const TagDetailPage = (): React.JSX.Element => {
    const params = useParams();
    const slug = params?.slug as string;
    const [page, setPage] = useState(1);

    const {
        data: tagData,
        isLoading,
        isError,
    } = useGetTagBySlugQuery({ slug, page, limit: 8 }, { skip: !slug });

    const tag = tagData?.data?.tag;
    const blogsResponse = tagData?.data?.blogs;
    const blogs = blogsResponse?.items ?? [];
    const pagination = blogsResponse?.pagination;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
                {/* Tag Header Banner */}
                <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                        <span>All Tags</span>
                    </Link>

                    {isLoading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="w-48 h-8 bg-[var(--bg-surface-subtle)] rounded-xl" />
                            <div className="w-96 h-4 bg-[var(--bg-surface-subtle)] rounded-md" />
                        </div>
                    ) : tag ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                    <FiTag className="w-5 h-5" />
                                </div>
                                <h1 className="font-mono text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                    #{tag.name}
                                </h1>
                            </div>
                            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                                {tag.description ||
                                    `Stories, architectural insights, and tutorials tagged with #${tag.name}.`}
                            </p>
                            <div className="text-xs text-[var(--text-muted)]">
                                Used in{' '}
                                <span className="font-semibold text-[var(--text-primary)]">
                                    {tag.usageCount}
                                </span>{' '}
                                stories
                            </div>
                        </div>
                    ) : (
                        <h1 className="font-serif text-2xl font-bold">Tag Not Found</h1>
                    )}
                </div>

                {/* Stories Feed */}
                {isLoading ? (
                    <SkeletonLoader type="feed" count={4} />
                ) : isError || blogs.length === 0 ? (
                    <div className="text-center py-20 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-3">
                        <FiTag className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-50" />
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                            No stories tagged with #{tag?.name || slug} yet
                        </h3>
                        <Link
                            href="/publish"
                            className="inline-block mt-2 px-5 py-2 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white"
                        >
                            Write a Story
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                            Tagged Stories ({pagination?.totalItems || blogs.length})
                        </h2>
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {blogs.map((b) => (
                                <StoryCard key={b.uuid} blog={b} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-10 border-t border-[var(--border-subtle)]">
                                <button
                                    type="button"
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40"
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
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] disabled:opacity-40"
                                >
                                    <span>Next</span>
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TagDetailPage;
