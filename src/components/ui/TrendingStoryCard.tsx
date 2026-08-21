'use client';

import Link from 'next/link';
import React from 'react';
import { FiClock, FiHeart } from 'react-icons/fi';
import type { Blog } from '@/types/blog';

interface TrendingStoryCardProps {
    blog: Blog;
    index: number;
}

export const TrendingStoryCard = ({ blog, index }: TrendingStoryCardProps): React.JSX.Element => {
    const authorName = blog.author
        ? `${blog.author.firstName} ${blog.author.lastName}`
        : 'Staff Writer';
    const authorInitial = authorName[0]?.toUpperCase() ?? 'A';
    const formattedDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
          })
        : 'Recent';

    const rankString = String(index + 1).padStart(2, '0');

    return (
        <article className="flex items-start gap-4 sm:gap-5 group">
            {/* Rank Number */}
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--border-strong)]/60 group-hover:text-[var(--accent-primary)]/70 transition-colors select-none">
                {rankString}
            </span>

            {/* Story Details */}
            <div className="flex-1 space-y-2">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                    {blog.author?.uuid ? (
                        <Link
                            href={`/author/${blog.author.uuid}`}
                            className="flex items-center gap-1.5 group/author"
                        >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                                {authorInitial}
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-primary)] group-hover/author:text-[var(--accent-primary)] transition-colors truncate max-w-[140px]">
                                {authorName}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                                {authorInitial}
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                                {authorName}
                            </span>
                        </div>
                    )}
                    {blog.category && (
                        <>
                            <span className="text-xs text-[var(--text-muted)]">in</span>
                            <Link
                                href={`/category/${blog.category.slug}`}
                                className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors truncate max-w-[110px]"
                            >
                                {blog.category.name}
                            </Link>
                        </>
                    )}
                </div>

                {/* Title */}
                <Link
                    href={`/story/${blog.slug}`}
                    className="block group-hover:text-[var(--accent-primary)] transition-colors"
                >
                    <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)] leading-snug line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {blog.readingTime || 3} min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FiHeart className="w-3 h-3 text-rose-500" />
                        {blog.likesCount || 0}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default TrendingStoryCard;
