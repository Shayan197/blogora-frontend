'use client';

import Link from 'next/link';
import React from 'react';
import { FiClock, FiHeart, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import type { Blog } from '@/types/blog';

interface FeaturedStoryHeroProps {
    blog: Blog;
}

export const FeaturedStoryHero = ({ blog }: FeaturedStoryHeroProps): React.JSX.Element => {
    const authorName = blog.author
        ? `${blog.author.firstName} ${blog.author.lastName}`
        : 'Editorial Staff';
    const authorInitial = authorName[0]?.toUpperCase() ?? 'E';
    const formattedDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Featured Story';

    return (
        <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-14 group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Content */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Badge & Category */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-widest bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
                            ★ Featured Story
                        </span>
                        {blog.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
                                {blog.category.name}
                            </span>
                        )}
                    </div>

                    {/* Headline */}
                    <Link
                        href={`/story/${blog.slug}`}
                        className="block group-hover:text-blue-300 transition-colors"
                    >
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                            {blog.title}
                        </h1>
                    </Link>

                    {/* Subtitle */}
                    {blog.subtitle && (
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl line-clamp-3">
                            {blog.subtitle}
                        </p>
                    )}

                    {/* Author & Read Action */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {authorInitial}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{authorName}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>{formattedDate}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FiClock className="w-3 h-3" />
                                        {blog.readingTime || 5} min read
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/story/${blog.slug}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-slate-950 hover:bg-blue-400 hover:text-slate-950 transition-all duration-200 shadow-lg shadow-white/10 group-hover:translate-x-1"
                        >
                            <span>Read Full Story</span>
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Hero Media */}
                {blog.coverImage && (
                    <div className="lg:col-span-5">
                        <Link
                            href={`/story/${blog.slug}`}
                            className="block relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/img"
                        >
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                                    <FiHeart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                    {blog.likesCount || 0} claps
                                </span>
                                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                                    <FiMessageSquare className="w-3.5 h-3.5 text-sky-400" />
                                    {blog.commentsCount || 0} comments
                                </span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedStoryHero;
