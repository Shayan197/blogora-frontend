'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FiEdit3, FiBookOpen, FiZap, FiBell } from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import TopicPill from '@/components/ui/TopicPill';
import { useGetMeQuery } from '@/redux/services/api/auth/auth';
import { useListBlogsQuery } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useGetNotificationsQuery } from '@/redux/services/api/notifications/notificationsApi';

export const Homepage = (): React.JSX.Element => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [feedSort, setFeedSort] = useState<'latest' | 'popular' | 'top'>('latest');

    const { data: userData } = useGetMeQuery();
    const { data: feedData, isLoading: isFeedLoading } = useListBlogsQuery({
        category: selectedCategory,
        sort: feedSort,
        limit: 8,
    });
    const { data: categoriesData } = useListCategoriesQuery();
    const { data: notifsData } = useGetNotificationsQuery({ limit: 3 });

    const user = userData?.data?.user;
    const blogs = feedData?.data?.items ?? [];
    const categories = categoriesData?.data?.categories ?? [];
    const notifications = notifsData?.data?.items ?? [];

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
                {/* Welcome & Quick Action Banner */}
                <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10">
                            <FiZap className="w-3.5 h-3.5 text-blue-400" />
                            <span>Member Dashboard</span>
                        </div>
                        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
                            {greeting()}, {user?.firstName ?? 'Writer'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                            Discover stories tailored to your interests, track notifications, or
                            draft your next piece.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/publish"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-blue-950 bg-white hover:bg-blue-50 transition-all shadow-md shadow-white/10"
                        >
                            <FiEdit3 className="w-4 h-4 text-blue-600" />
                            <span>Write a Story</span>
                        </Link>
                        <Link
                            href="/dashboard/stories"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
                        >
                            <FiBookOpen className="w-4 h-4" />
                            <span>My Stories</span>
                        </Link>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* Feed Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Feed Controls Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-4 sm:gap-6 text-sm font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setFeedSort('latest')}
                                    className={`pb-2 relative transition-colors cursor-pointer ${
                                        feedSort === 'latest'
                                            ? 'text-[var(--text-primary)]'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                                >
                                    <span>Latest Stories</span>
                                    {feedSort === 'latest' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFeedSort('popular')}
                                    className={`pb-2 relative transition-colors cursor-pointer ${
                                        feedSort === 'popular'
                                            ? 'text-[var(--text-primary)]'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                                >
                                    <span>Most Read</span>
                                    {feedSort === 'popular' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFeedSort('top')}
                                    className={`pb-2 relative transition-colors cursor-pointer ${
                                        feedSort === 'top'
                                            ? 'text-[var(--text-primary)]'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                    }`}
                                >
                                    <span>Top Claps</span>
                                    {feedSort === 'top' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                                    )}
                                </button>
                            </div>

                            {selectedCategory && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(undefined)}
                                    className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                                >
                                    Clear topic filter
                                </button>
                            )}
                        </div>

                        {/* Stories Feed */}
                        {isFeedLoading ? (
                            <SkeletonLoader type="feed" count={4} />
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-16 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-3">
                                <FiBookOpen className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
                                <h3 className="text-base font-bold text-[var(--text-primary)]">
                                    No stories available
                                </h3>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Be the first author to publish in this topic!
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border-subtle)]">
                                {blogs.map((b) => (
                                    <StoryCard key={b.uuid} blog={b} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Quick User Card */}
                        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                                        {user?.firstName} {user?.lastName}
                                    </h4>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                                <Link
                                    href="/editprofile"
                                    className="font-semibold text-[var(--accent-primary)] hover:underline"
                                >
                                    Edit Profile Settings
                                </Link>
                                <Link
                                    href="/dashboard/stories"
                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                >
                                    Story Studio →
                                </Link>
                            </div>
                        </div>

                        {/* Recent Notifications Widget */}
                        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                    <FiBell className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Recent Activity</span>
                                </h4>
                                <Link
                                    href="/notifications"
                                    className="text-xs text-[var(--accent-primary)] hover:underline font-semibold"
                                >
                                    View all
                                </Link>
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-xs text-[var(--text-muted)] py-2">
                                    No new notifications.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.uuid}
                                            className="p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] text-xs text-[var(--text-secondary)] leading-snug"
                                        >
                                            {n.message}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Topics Filter */}
                        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-3">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                                Filter by Topic
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((c) => (
                                    <TopicPill
                                        key={c.uuid}
                                        name={c.name}
                                        slug={c.slug}
                                        color={c.color}
                                        isActive={selectedCategory === c.slug}
                                        onClick={() =>
                                            setSelectedCategory(
                                                selectedCategory === c.slug ? undefined : c.slug,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;
