'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit3, FiTrash2, FiEye, FiHeart, FiMessageSquare, FiPlus } from 'react-icons/fi';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import {
    useGetMyBlogsQuery,
    useDeleteBlogMutation,
    useTogglePublishStatusMutation,
} from '@/redux/services/api/blogs/blogsApi';
import type { Blog } from '@/types/blog';

export const StoriesDashboardPage = (): React.JSX.Element => {
    const [statusTab, setStatusTab] = useState<'published' | 'draft' | 'archived'>('published');
    const [deletingBlogUuid, setDeletingBlogUuid] = useState<string | null>(null);

    const {
        data: blogsData,
        isLoading,
        isFetching,
    } = useGetMyBlogsQuery({
        status: statusTab,
    });
    const [deleteBlogReq, { isLoading: isDeleting }] = useDeleteBlogMutation();
    const [togglePublishReq] = useTogglePublishStatusMutation();

    const blogs = blogsData?.data?.items ?? [];

    const handleDelete = async () => {
        if (!deletingBlogUuid) return;
        try {
            await deleteBlogReq(deletingBlogUuid).unwrap();
            toast.success('Story deleted successfully');
            setDeletingBlogUuid(null);
        } catch {
            toast.error('Failed to delete story');
        }
    };

    const handleTogglePublish = async (uuid: string, currentStatus: string) => {
        try {
            await togglePublishReq(uuid).unwrap();
            toast.success(
                currentStatus === 'published'
                    ? 'Story moved to drafts'
                    : 'Story published to feed!',
            );
        } catch {
            toast.error('Failed to update story status');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <ConfirmModal
                isOpen={!!deletingBlogUuid}
                title="Delete Story"
                description="Are you sure you want to delete this story? This action cannot be undone."
                confirmLabel="Delete Forever"
                isDestructive
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeletingBlogUuid(null)}
            />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="space-y-1">
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                            Your Stories
                        </h1>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            Manage drafts, published articles, and audience engagement.
                        </p>
                    </div>

                    <Link
                        href="/publish"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Write a Story</span>
                    </Link>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-6 border-b border-[var(--border-subtle)] text-sm font-semibold">
                    {(['published', 'draft', 'archived'] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setStatusTab(tab)}
                            className={`pb-3 capitalize transition-colors relative cursor-pointer ${
                                statusTab === tab
                                    ? 'text-[var(--text-primary)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                            }`}
                        >
                            <span>{tab}s</span>
                            {statusTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Stories Listing */}
                {isLoading || isFetching ? (
                    <SkeletonLoader type="feed" count={3} />
                ) : blogs.length === 0 ? (
                    <EmptyState
                        title={`No ${statusTab} stories`}
                        description={`You don't have any stories under ${statusTab}. Start writing one today!`}
                        actionLabel="Write New Story"
                        actionHref="/publish"
                    />
                ) : (
                    <div className="space-y-4">
                        {blogs.map((b: Blog) => {
                            const formattedDate = b.publishedAt
                                ? new Date(b.publishedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                  })
                                : 'Unpublished';

                            return (
                                <div
                                    key={b.uuid}
                                    className="card-editorial p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            {b.category && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]">
                                                    {b.category.name}
                                                </span>
                                            )}
                                            <span className="text-xs text-[var(--text-muted)]">
                                                {formattedDate}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                                    b.status === 'published'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                }`}
                                            >
                                                {b.status}
                                            </span>
                                        </div>

                                        <Link href={`/story/${b.slug}`} className="block group">
                                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                                {b.title}
                                            </h3>
                                        </Link>

                                        {/* Metrics Bar */}
                                        <div className="flex items-center gap-5 text-xs text-[var(--text-muted)] pt-1">
                                            <span className="flex items-center gap-1.5">
                                                <FiEye className="w-3.5 h-3.5" />
                                                {b.viewsCount || 0} views
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiHeart className="w-3.5 h-3.5 text-rose-500" />
                                                {b.likesCount || 0} claps
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FiMessageSquare className="w-3.5 h-3.5 text-blue-500" />
                                                {b.commentsCount || 0} comments
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        <Link
                                            href={`/edit/${b.uuid}`}
                                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                                        >
                                            <FiEdit3 className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleTogglePublish(b.uuid, b.status)}
                                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                                        >
                                            {b.status === 'published' ? 'Move to Draft' : 'Publish'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setDeletingBlogUuid(b.uuid)}
                                            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            aria-label="Delete Story"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default StoriesDashboardPage;
