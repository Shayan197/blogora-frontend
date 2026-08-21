'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FiClock, FiEye, FiArrowLeft, FiTag, FiChevronRight } from 'react-icons/fi';
import CommentSection from '@/components/ui/CommentSection';
import Footer from '@/components/ui/Footer';
import LikeButton from '@/components/ui/LikeButton';
import Navbar from '@/components/ui/Navbar';
import ShareModal from '@/components/ui/ShareModal';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import { useGetBlogBySlugQuery, useListBlogsQuery } from '@/redux/services/api/blogs/blogsApi';

export const StoryDetailPage = (): React.JSX.Element => {
    const params = useParams();
    const slug = params?.slug as string;

    const [scrollProgress, setScrollProgress] = useState(0);

    const { data: blogData, isLoading, isError } = useGetBlogBySlugQuery(slug, { skip: !slug });
    const blog = blogData?.data?.blog;
    const isLikedByMe = blogData?.data?.isLikedByMe ?? false;

    // Fetch related stories in the same category
    const { data: relatedData } = useListBlogsQuery(
        { category: blog?.category?.slug, limit: 3 },
        { skip: !blog?.category?.slug },
    );
    const relatedBlogs = (relatedData?.data?.items ?? [])
        .filter((b) => b.uuid !== blog?.uuid)
        .slice(0, 2);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const current = (window.scrollY / totalHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, current)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)]">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                    <SkeletonLoader type="story" />
                </main>
                <Footer />
            </div>
        );
    }

    if (isError || !blog) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <Navbar />
                <main className="flex-1 max-w-lg mx-auto w-full px-4 py-24 text-center space-y-4">
                    <h2 className="font-serif text-3xl font-bold">Story Not Found</h2>
                    <p className="text-sm text-[var(--text-muted)]">
                        This story may have been unpublished or removed by the author.
                    </p>
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white cursor-pointer"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Explore Other Stories</span>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const authorName = blog.author
        ? `${blog.author.firstName} ${blog.author.lastName}`
        : 'Chronicle Staff';
    const authorInitial = authorName[0]?.toUpperCase() ?? 'A';
    const authorHeadline =
        blog.author?.profile?.headline || blog.author?.bio || 'Author & Contributor';
    const formattedDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Draft Story';

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            {/* Scroll Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 transition-all duration-75"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Link href="/" className="hover:text-[var(--text-primary)]">
                        Home
                    </Link>
                    <FiChevronRight className="w-3 h-3" />
                    {blog.category ? (
                        <>
                            <Link
                                href={`/category/${blog.category.slug}`}
                                className="hover:text-[var(--text-primary)]"
                            >
                                {blog.category.name}
                            </Link>
                            <FiChevronRight className="w-3 h-3" />
                        </>
                    ) : null}
                    <span className="truncate max-w-[200px] text-[var(--text-secondary)]">
                        {blog.title}
                    </span>
                </div>

                {/* Article Header */}
                <header className="space-y-6">
                    {/* Category Chip */}
                    {blog.category && (
                        <Link
                            href={`/category/${blog.category.slug}`}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"
                        >
                            {blog.category.name}
                        </Link>
                    )}

                    {/* Headline */}
                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.14]">
                        {blog.title}
                    </h1>

                    {/* Subtitle */}
                    {blog.subtitle && (
                        <p className="text-lg sm:text-2xl text-[var(--text-secondary)] font-serif italic leading-relaxed">
                            {blog.subtitle}
                        </p>
                    )}

                    {/* Author & Publication Metadata Bar */}
                    <div className="py-6 border-y border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {blog.author?.uuid ? (
                                <Link
                                    href={`/author/${blog.author.uuid}`}
                                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group"
                                >
                                    {authorInitial}
                                </Link>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                                    {authorInitial}
                                </div>
                            )}

                            <div>
                                {blog.author?.uuid ? (
                                    <Link
                                        href={`/author/${blog.author.uuid}`}
                                        className="text-sm sm:text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                                    >
                                        {authorName}
                                    </Link>
                                ) : (
                                    <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                                        {authorName}
                                    </span>
                                )}
                                <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                                    {authorHeadline}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] pt-0.5">
                                    <span>{formattedDate}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FiClock className="w-3.5 h-3.5" />
                                        {blog.readingTime || 4} min read
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FiEye className="w-3.5 h-3.5" />
                                        {blog.viewsCount || 0} views
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top Claps & Share Action */}
                        <div className="flex items-center gap-3">
                            <LikeButton
                                blogUuid={blog.uuid}
                                initialLiked={isLikedByMe}
                                initialCount={blog.likesCount}
                                size="sm"
                            />
                            <ShareModal title={blog.title} />
                        </div>
                    </div>
                </header>

                {/* Hero Cover Image */}
                {blog.coverImage && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] shadow-xl">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Main Article Body (Clean Markdown/Editorial Layout) */}
                <article className="prose prose-lg dark:prose-invert max-w-none font-serif-editorial text-[var(--text-primary)] leading-relaxed space-y-6 text-lg sm:text-xl selection:bg-blue-500/20">
                    {blog.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </article>

                {/* Tags Section */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                            <FiTag className="w-3.5 h-3.5" />
                            <span>Topics & Tags</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((t) => (
                                <Link
                                    key={t.uuid}
                                    href={`/tag/${t.slug}`}
                                    className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                                >
                                    #{t.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Claps & Share Bar Bottom */}
                <div className="p-6 rounded-3xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <LikeButton
                            blogUuid={blog.uuid}
                            initialLiked={isLikedByMe}
                            initialCount={blog.likesCount}
                            size="md"
                        />
                    </div>
                    <ShareModal title={blog.title} />
                </div>

                {/* Author Biography Card */}
                {blog.author && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
                        <span className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                            Written by
                        </span>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {authorInitial}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                                        {authorName}
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] max-w-md">
                                        {blog.author.profile?.bio ||
                                            blog.author.bio ||
                                            'Sharing systems engineering, product strategy, and architectural reflections on Chronicle.'}
                                    </p>
                                </div>
                            </div>

                            {blog.author.uuid && (
                                <Link
                                    href={`/author/${blog.author.uuid}`}
                                    className="px-5 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] transition-colors cursor-pointer"
                                >
                                    View Full Profile
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Threaded Discussion Section */}
                <CommentSection blogUuid={blog.uuid} />

                {/* Related Stories Grid */}
                {relatedBlogs.length > 0 && (
                    <section className="pt-12 border-t border-[var(--border-subtle)] space-y-6">
                        <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                            More in {blog.category?.name || 'Related Stories'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {relatedBlogs.map((b) => (
                                <StoryCard key={b.uuid} blog={b} layout="grid" />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default StoryDetailPage;
