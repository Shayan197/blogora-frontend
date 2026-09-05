'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import {
    FiTrendingUp,
    FiBookOpen,
    FiCompass,
    FiEdit3,
    FiZap,
    FiAward,
    FiArrowRight,
    FiFeather,
    FiLayers,
    FiCheckCircle,
} from 'react-icons/fi';
import FeaturedStoryHero from '@/components/ui/FeaturedStoryHero';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SearchModal from '@/components/ui/SearchModal';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import TopicPill from '@/components/ui/TopicPill';
import TrendingStoryCard from '@/components/ui/TrendingStoryCard';
import { useListBlogsQuery, useGetTrendingBlogsQuery } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useListTagsQuery } from '@/redux/services/api/tags/tagsApi';

export const HomePage = (): React.JSX.Element => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [activeSort, setActiveSort] = useState<'latest' | 'popular' | 'top'>('latest');

    // API queries
    const { data: trendingData, isLoading: isTrendingLoading } = useGetTrendingBlogsQuery();
    const { data: feedData, isLoading: isFeedLoading } = useListBlogsQuery({
        category: selectedCategory,
        sort: activeSort,
        limit: 8,
    });
    const { data: categoriesData } = useListCategoriesQuery();
    const { data: tagsData } = useListTagsQuery({ limit: 10 });

    const trendingBlogs = trendingData?.data?.blogs ?? [];
    const feedBlogs = feedData?.data?.items ?? [];
    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    const topFeaturedBlog =
        trendingBlogs.find((b) => b.isFeatured) ?? trendingBlogs[0] ?? feedBlogs[0];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-500 selection:text-white">
            <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <main className="flex-1 space-y-16 sm:space-y-24">
                {/* Hero Showcase Section */}
                <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-18 border-b border-border-subtle bg-linear-to-b from-surface to-transparent">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/3 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl space-y-6 sm:space-y-8">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-sm">
                                <FiZap className="w-3.5 h-3.5 text-blue-500" />
                                <span>Curated Publishing & Deep Engineering Thoughts</span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.08]">
                                Stay curious. <br />
                                <span className="text-gradient">Ideas that ignite</span> minds and
                                code.
                            </h1>

                            <p className="text-base sm:text-xl text-text-secondary leading-relaxed font-normal max-w-2xl">
                                Discover stories, technical architecture breakthroughs, and
                                insightful essays from writers and engineers shaping the future of
                                software, design, and culture.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/explore"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5"
                                >
                                    <FiCompass className="w-4 h-4" />
                                    <span>Start Reading</span>
                                </Link>
                                <Link
                                    href="/publish"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-text-primary bg-surface hover:bg-surface-subtle border border-border-subtle hover:border-border-strong transition-all duration-200"
                                >
                                    <FiEdit3 className="w-4 h-4 text-blue-500" />
                                    <span>Start Writing</span>
                                </Link>
                            </div>
                        </div>

                        {/* Top Featured Hero Banner if available */}
                        {topFeaturedBlog && (
                            <div className="mt-14 sm:mt-20">
                                <FeaturedStoryHero blog={topFeaturedBlog} />
                            </div>
                        )}
                    </div>
                </section>

                {/* Trending on Chronicle Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8 pb-3 border-b border-border-subtle">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <FiTrendingUp className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm uppercase tracking-widest font-bold text-text-primary">
                                Trending on Chronicle
                            </h2>
                        </div>
                        <Link
                            href="/explore?sort=popular"
                            className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1"
                        >
                            <span>See all trending</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {isTrendingLoading ? (
                        <SkeletonLoader type="trending" count={6} />
                    ) : trendingBlogs.length === 0 ? (
                        <div className="text-center py-8 text-sm text-text-muted">
                            No trending stories currently. Be the first to publish one!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                            {trendingBlogs.slice(0, 6).map((blog, idx) => (
                                <TrendingStoryCard key={blog.uuid} blog={blog} index={idx} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Topics & Curated Feed Multi-Column Layout */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        {/* Main Feed Column */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Feed Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                                <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-1">
                                    {(['latest', 'popular', 'top'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveSort(tab)}
                                            className={`text-sm font-semibold capitalize pb-2 transition-colors relative ${
                                                activeSort === tab
                                                    ? 'text-text-primary'
                                                    : 'text-text-muted hover:text-text-secondary'
                                            }`}
                                        >
                                            {tab === 'latest' ? 'For You' : tab}
                                            {activeSort === tab && (
                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {selectedCategory && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory(undefined)}
                                        className="text-xs font-semibold text-rose-500 hover:underline"
                                    >
                                        Clear category filter
                                    </button>
                                )}
                            </div>

                            {/* Feed List */}
                            {isFeedLoading ? (
                                <SkeletonLoader type="feed" count={4} />
                            ) : feedBlogs.length === 0 ? (
                                <div className="py-16 text-center space-y-3">
                                    <FiBookOpen className="w-8 h-8 mx-auto text-text-muted" />
                                    <p className="text-base font-semibold text-text-primary">
                                        No stories in this topic yet
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        Explore other categories or publish a new story.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {feedBlogs.map((blog) => (
                                        <StoryCard key={blog.uuid} blog={blog} />
                                    ))}
                                </div>
                            )}

                            <div className="pt-8 text-center">
                                <Link
                                    href="/explore"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold border border-border-subtle bg-surface text-text-primary hover:border-accent-primary transition-all shadow-sm"
                                >
                                    <span>Discover More Stories in Archive</span>
                                    <FiArrowRight className="w-4 h-4 text-accent-primary" />
                                </Link>
                            </div>
                        </div>

                        {/* Sticky Sidebar Column */}
                        <aside className="lg:col-span-4 space-y-10">
                            {/* Discover Topics */}
                            <div className="p-6 rounded-3xl bg-surface border border-border-subtle shadow-sm space-y-4">
                                <h3 className="text-xs uppercase tracking-widest font-bold text-text-primary">
                                    Recommended Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((c) => (
                                        <TopicPill
                                            key={c.uuid}
                                            name={c.name}
                                            slug={c.slug}
                                            count={c.blogsCount}
                                            color={c.color}
                                            isActive={selectedCategory === c.slug}
                                            onClick={() =>
                                                setSelectedCategory(
                                                    selectedCategory === c.slug
                                                        ? undefined
                                                        : c.slug,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags Cloud */}
                            {tags.length > 0 && (
                                <div className="p-6 rounded-3xl bg-surface border border-border-subtle shadow-sm space-y-4">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-text-primary">
                                        Trending Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((t) => (
                                            <Link
                                                key={t.uuid}
                                                href={`/tag/${t.slug}`}
                                                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-surface-subtle text-text-secondary hover:bg-accent-primary-subtle hover:text-accent-primary border border-border-subtle transition-colors"
                                            >
                                                #{t.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Creator Callout Card */}
                            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 space-y-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                    <FiFeather className="w-5 h-5" />
                                </div>
                                <h4 className="font-serif text-xl font-bold leading-snug">
                                    Write on Chronicle
                                </h4>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    Share your expertise with a community of ambitious software
                                    engineers, product architects, and lifelong learners.
                                </p>
                                <Link
                                    href="/publish"
                                    className="inline-block px-5 py-2.5 rounded-full text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    Start Writing Today
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Visual Storytelling Section (Inspired by Diego Vaz & Reshta) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden bg-surface border border-border-subtle shadow-xl p-8 sm:p-14 lg:p-20">
                        <div className="max-w-3xl space-y-8">
                            <div className="space-y-3">
                                <span className="text-xs uppercase tracking-widest font-bold text-accent-primary">
                                    The Editorial Standard
                                </span>
                                <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
                                    Crafted for deep focus, timeless clarity, and technical truth.
                                </h2>
                            </div>

                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                                In an internet crowded with transient noise, Chronicle is built as a
                                sanctuary for rigorous technical documentation, long-form systems
                                insights, and nuanced narratives.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                <div className="space-y-2 p-5 rounded-2xl bg-surface-subtle border border-border-subtle">
                                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span>Distraction-Free</span>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Typography optimized for immersive, fatigue-free technical
                                        reading.
                                    </p>
                                </div>
                                <div className="space-y-2 p-5 rounded-2xl bg-surface-subtle border border-border-subtle">
                                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
                                        <FiLayers className="w-4 h-4" />
                                        <span>Full Ownership</span>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Seamless draft auto-saving, version history, and publishing
                                        controls.
                                    </p>
                                </div>
                                <div className="space-y-2 p-5 rounded-2xl bg-surface-subtle border border-border-subtle">
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                                        <FiAward className="w-4 h-4" />
                                        <span>Rich Dialogue</span>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Threaded discussion trees and clapping micro-interactions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
