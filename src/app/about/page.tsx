'use client';

import Link from 'next/link';
import React from 'react';
import { FiAward, FiCode, FiShield, FiHeart, FiCheckCircle } from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

export const AboutPage = (): React.JSX.Element => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                        <FiHeart className="w-3.5 h-3.5 text-blue-500" />
                        <span>Our Vision & Heritage</span>
                    </span>
                    <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.12]">
                        A home for ideas that shape software, systems, and craft.
                    </h1>
                    <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed">
                        Chronicle was built on a simple conviction: nuanced technical ideas deserve
                        an uncompromised editorial reading experience free from aggressive popups,
                        tracking, and noise.
                    </p>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card-editorial p-8 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                            <FiCode className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                            Deep Technical Rigor
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Engineered for backend architects, frontend pioneers, and systems
                            builders who appreciate detailed, production-tested knowledge sharing.
                        </p>
                    </div>

                    <div className="card-editorial p-8 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                            <FiAward className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                            Editorial Typography
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Typography scales, harmonious spacing, dark/light contrast ratios, and
                            responsive formatting that honor the craft of written expression.
                        </p>
                    </div>

                    <div className="card-editorial p-8 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <FiShield className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                            Modern Architecture
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Built with Next.js 16, React 19, Redux Toolkit Query, PostgreSQL, and
                            Sequelize, ensuring speed, resilient state management, and scalability.
                        </p>
                    </div>
                </div>

                {/* Engineering Highlights */}
                <div className="rounded-3xl p-8 sm:p-14 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl space-y-8">
                    <div className="max-w-2xl space-y-3">
                        <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-primary)]">
                            Platform Blueprint
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                            Engineered with integrity from database to pixel.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>
                                <strong>Multi-Tier Authentication:</strong> JWT access & refresh
                                lifecycle with race-condition safe refresh locking and OTP
                                verification.
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>
                                <strong>Threaded Discussions:</strong> Relational parent-reply
                                comment trees with live optimistic updates and moderation
                                permissions.
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>
                                <strong>Centralized Token System:</strong> Semantic CSS variables
                                mapped to Tailwind v4 inline theme tokens for consistent light &
                                dark themes.
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>
                                <strong>Relational Integrity:</strong> PostgreSQL soft deletes,
                                automatic reading time computation, and slug collision safeguards.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Call to action */}
                <div className="text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white space-y-6 shadow-2xl">
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                        Ready to contribute your thoughts?
                    </h2>
                    <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
                        Join thousands of software professionals and writers who publish their best
                        work on Chronicle.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link
                            href="/publish"
                            className="px-8 py-3.5 rounded-full text-sm font-bold text-blue-900 bg-white hover:bg-blue-50 transition-colors shadow-lg"
                        >
                            Start Writing Now
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
