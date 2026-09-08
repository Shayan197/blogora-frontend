'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiHeart, FiMessageSquare, FiBookmark, FiClock } from 'react-icons/fi';
import type { Blog } from '@/types/blog';

interface StoryCardProps {
    blog: Blog;
    layout?: 'horizontal' | 'compact' | 'grid';
    featured?: boolean;
}

export const StoryCard = ({
    blog,
    layout = 'horizontal',
    featured = false,
}: StoryCardProps): React.JSX.Element => {
    const authorName = blog.author
        ? `${blog.author.firstName} ${blog.author.lastName}`
        : 'Chronicle Staff';
    const authorInitial = authorName[0]?.toUpperCase() ?? 'A';
    const formattedDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Recently';

    if (layout === 'grid') {
        return (
            <article className="card-editorial flex flex-col justify-between overflow-hidden group h-full">
                {/* Cover Image */}
                {blog.coverImage && (
                    <Link
                        href={`/story/${blog.slug}`}
                        className="block relative aspect-video w-full overflow-hidden bg-[var(--bg-surface-subtle)]"
                    >
                        <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                        {blog.category && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--bg-glass)] backdrop-blur-md text-[var(--text-primary)] border border-[var(--border-subtle)]">
                                {blog.category.name}
                            </span>
                        )}
                    </Link>
                )}

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                        {/* Author Info */}
                        <div className="flex items-center gap-2.5">
                            {blog.author?.uuid ? (
                                <Link
                                    href={`/author/${blog.author.uuid}`}
                                    className="flex items-center gap-2 group/author"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                                        {authorInitial}
                                    </div>
                                    <span className="text-xs font-medium text-[var(--text-primary)] group-hover/author:text-[var(--accent-primary)] transition-colors">
                                        {authorName}
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                                        {authorInitial}
                                    </div>
                                    <span className="text-xs font-medium text-[var(--text-primary)]">
                                        {authorName}
                                    </span>
                                </div>
                            )}
                            <span className="text-xs text-[var(--text-muted)]">•</span>
                            <span className="text-xs text-[var(--text-muted)]">
                                {formattedDate}
                            </span>
                        </div>

                        {/* Title & Subtitle */}
                        <Link
                            href={`/story/${blog.slug}`}
                            className="block group-hover:text-[var(--accent-primary)] transition-colors"
                        >
                            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] leading-snug line-clamp-2">
                                {blog.title}
                            </h3>
                            {blog.subtitle && (
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 mt-1.5 leading-relaxed">
                                    {blog.subtitle}
                                </p>
                            )}
                        </Link>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <FiClock className="w-3.5 h-3.5" />
                                {blog.readingTime || 4} min read
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                <FiHeart className="w-3.5 h-3.5" />
                                {blog.likesCount || 0}
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                <FiMessageSquare className="w-3.5 h-3.5" />
                                {blog.commentsCount || 0}
                            </span>
                        </div>
                        <button
                            type="button"
                            aria-label="Bookmark story"
                            className="p-1 hover:text-[var(--text-primary)] transition-colors"
                        >
                            <FiBookmark className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    // Default Horizontal Layout (Medium Classic)
    return (
        <article className="group py-6 sm:py-8 border-b border-[var(--border-subtle)] last:border-0">
            <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-6">
                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Author Bar */}
                    <div className="flex items-center gap-2.5">
                        {blog.author?.uuid ? (
                            <Link
                                href={`/author/${blog.author.uuid}`}
                                className="flex items-center gap-2 group/author"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                                    {authorInitial}
                                </div>
                                <span className="text-xs font-semibold text-[var(--text-primary)] group-hover/author:text-[var(--accent-primary)] transition-colors">
                                    {authorName}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                                    {authorInitial}
                                </div>
                                <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    {authorName}
                                </span>
                            </div>
                        )}
                        <span className="text-xs text-[var(--text-muted)]">•</span>
                        <span className="text-xs text-[var(--text-muted)]">{formattedDate}</span>
                        {featured && (
                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Staff Pick
                            </span>
                        )}
                    </div>

                    {/* Headline & Abstract */}
                    <Link
                        href={`/story/${blog.slug}`}
                        className="block group-hover:text-[var(--accent-primary)] transition-colors"
                    >
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-snug line-clamp-2">
                            {blog.title}
                        </h2>
                        {blog.subtitle && (
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1.5 leading-relaxed">
                                {blog.subtitle}
                            </p>
                        )}
                    </Link>

                    {/* Tags & Footer Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-3">
                            {blog.category && (
                                <Link
                                    href={`/category/${blog.category.slug}`}
                                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {blog.category.name}
                                </Link>
                            )}
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {blog.readingTime || 4} min read
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                <FiHeart className="w-3.5 h-3.5" />
                                {blog.likesCount || 0}
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                <FiMessageSquare className="w-3.5 h-3.5" />
                                {blog.commentsCount || 0}
                            </span>
                            <button
                                type="button"
                                aria-label="Save story"
                                className="p-1 hover:text-[var(--text-primary)] transition-colors"
                            >
                                <FiBookmark className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Image */}
                {blog.coverImage && (
                    <Link
                        href={`/story/${blog.slug}`}
                        className="w-full sm:w-44 lg:w-52 aspect-video sm:aspect-square flex-shrink-0 rounded-2xl overflow-hidden bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]"
                    >
                        <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                    </Link>
                )}
            </div>
        </article>
    );
};

export default StoryCard;
