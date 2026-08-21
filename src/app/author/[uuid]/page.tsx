'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import {
    FiMapPin,
    FiGlobe,
    FiTwitter,
    FiGithub,
    FiLinkedin,
    FiBookOpen,
    FiArrowLeft,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import StoryCard from '@/components/ui/StoryCard';
import { useListBlogsQuery } from '@/redux/services/api/blogs/blogsApi';
import { useGetPublicProfileQuery } from '@/redux/services/api/profiles/profilesApi';

export const AuthorProfilePage = (): React.JSX.Element => {
    const params = useParams();
    const userUuid = params?.uuid as string;

    const {
        data: profileData,
        isLoading,
        isError,
    } = useGetPublicProfileQuery(userUuid, {
        skip: !userUuid,
    });
    const { data: authorBlogsData } = useListBlogsQuery(
        { author: userUuid, limit: 10 },
        { skip: !userUuid },
    );

    const user = profileData?.data?.user;
    const profile = user?.profile;
    const stats = profileData?.data?.stats;
    const authorBlogs = authorBlogsData?.data?.items ?? [];

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

    if (isError || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <Navbar />
                <main className="flex-1 max-w-md mx-auto w-full px-4 py-24 text-center space-y-4">
                    <h2 className="font-serif text-3xl font-bold">Author Not Found</h2>
                    <p className="text-sm text-[var(--text-muted)]">
                        The requested author profile does not exist or has been deactivated.
                    </p>
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white cursor-pointer"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Explore Community</span>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const authorName = `${user.firstName} ${user.lastName}`;
    const authorInitial = authorName[0]?.toUpperCase() ?? 'A';

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
                {/* Author Card Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl p-8 sm:p-12 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            {profile?.avatar || user.avatar ? (
                                <img
                                    src={profile?.avatar || user.avatar || ''}
                                    alt={authorName}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[var(--border-subtle)] shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-serif font-black text-3xl shadow-md">
                                    {authorInitial}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                                        {authorName}
                                    </h1>
                                    {user.role && (
                                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                                            {user.role.name}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium">
                                    {profile?.headline ||
                                        user.bio ||
                                        'Author & Contributor on Chronicle'}
                                </p>
                                {profile?.location && (
                                    <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                        <FiMapPin className="w-3.5 h-3.5" />
                                        <span>{profile.location}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Author Publication Stats */}
                        <div className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                            <div className="text-center">
                                <span className="block text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                                    {stats?.publishedBlogsCount ?? authorBlogs.length}
                                </span>
                                <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                                    Stories
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                            {profile.bio}
                        </p>
                    )}

                    {/* Social Profiles */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {profile?.websiteUrl && (
                            <a
                                href={profile.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiGlobe className="w-3.5 h-3.5" />
                                <span>Website</span>
                            </a>
                        )}
                        {profile?.twitterUrl && (
                            <a
                                href={profile.twitterUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-sky-500 border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiTwitter className="w-3.5 h-3.5" />
                                <span>Twitter</span>
                            </a>
                        )}
                        {profile?.githubUrl && (
                            <a
                                href={profile.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiGithub className="w-3.5 h-3.5" />
                                <span>GitHub</span>
                            </a>
                        )}
                        {profile?.linkedinUrl && (
                            <a
                                href={profile.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-blue-600 border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiLinkedin className="w-3.5 h-3.5" />
                                <span>LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Published Stories List */}
                <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <FiBookOpen className="w-5 h-5 text-[var(--accent-primary)]" />
                        <span>Stories by {user.firstName}</span>
                    </h2>

                    {authorBlogs.length === 0 ? (
                        <div className="text-center py-16 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-muted)]">
                                {user.firstName} hasn&apos;t published any stories yet.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {authorBlogs.map((b) => (
                                <StoryCard key={b.uuid} blog={b} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AuthorProfilePage;
