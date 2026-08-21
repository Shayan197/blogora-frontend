'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiGithub, FiTwitter, FiLinkedin, FiSend } from 'react-icons/fi';

export const Footer = (): React.JSX.Element => {
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        toast.success('Thank you for subscribing to Chronicle Editorial!');
        setNewsletterEmail('');
    };

    const categories = [
        { name: 'Software Engineering', slug: 'software-engineering' },
        { name: 'Web Development', slug: 'web-development' },
        { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
        { name: 'UI & UX Design', slug: 'ui-ux-design' },
        { name: 'Lifestyle', slug: 'lifestyle' },
        { name: 'Career & Growth', slug: 'career-growth' },
    ];

    return (
        <footer className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
                    {/* Brand & Mission */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                <span className="font-serif font-black text-xl">C</span>
                            </div>
                            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                                Chronicle
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                            A refined space for deep thinking, technical excellence, and
                            storytelling. Connecting discerning writers with engaged readers across
                            software, design, and ideas.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2.5 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiGithub className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter / X"
                                className="p-2.5 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="p-2.5 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] border border-[var(--border-subtle)] transition-colors"
                            >
                                <FiLinkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Topics Sitemap */}
                    <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                            Featured Topics
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {categories.map((c, i) => (
                                <li key={i}>
                                    <Link
                                        href={`/category/${c.slug}`}
                                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/explore"
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    Explore Feed
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    Our Story & Vision
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    Contact & Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/publish"
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    Write with Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                            Curated Dispatch
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Handpicked technical stories and editorial pieces delivered weekly to
                            your inbox.
                        </p>
                        <form onSubmit={handleNewsletter} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="your.email@domain.com"
                                    className="w-full pl-3.5 pr-10 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                                >
                                    <FiSend className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] block">
                                No spam. Unsubscribe at any time.
                            </span>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
                    <p>
                        © {new Date().getFullYear()} Chronicle Publishing Platform. Built with
                        Next.js, TypeScript & PostgreSQL.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/about"
                            className="hover:text-[var(--text-primary)] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/about"
                            className="hover:text-[var(--text-primary)] transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-[var(--text-primary)] transition-colors"
                        >
                            Editorial Guidelines
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
