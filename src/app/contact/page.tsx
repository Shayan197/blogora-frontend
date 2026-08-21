'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiSend, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

export const ContactPage = (): React.JSX.Element => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast.error('Please fill out all required fields');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Thank you! Your message has been sent to our editorial desk.');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }, 800);
    };

    const faqs = [
        {
            q: 'How do I submit an article for publication?',
            a: 'Create a free account, complete your profile, and click "Write" in the top navigation bar. You can save unlimited drafts and publish whenever you are ready.',
        },
        {
            q: 'Can I import stories from other platforms?',
            a: 'Yes, you can paste formatted Markdown or raw text directly into our editor studio. Slug, reading time, and previews are generated automatically.',
        },
        {
            q: 'How does the claps and discussion system work?',
            a: 'Logged-in readers can clap for stories and leave threaded comments or reply to specific commenters in a structured discussion tree.',
        },
        {
            q: 'How can I become an Editor or Moderator?',
            a: 'Editors and moderators are appointed by administrators based on community contributions, editorial quality, and technical expertise.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                        <FiMail className="w-3.5 h-3.5" />
                        <span>Get in Touch</span>
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        Contact Editorial Desk
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                        Have a story inquiry, platform suggestion, or technical feedback? We’d love
                        to hear from you.
                    </p>
                </div>

                {/* Form & Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* Contact Form */}
                    <div className="lg:col-span-7 card-editorial p-6 sm:p-10 space-y-6">
                        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                            Send us a message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Mercer"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@domain.com"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Story Submission / Feature Feedback"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Message *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your message here..."
                                    className="w-full p-3.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-all shadow-sm cursor-pointer"
                            >
                                <FiSend className="w-3.5 h-3.5" />
                                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* FAQ & Support Info */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <FiHelpCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                                <span>Frequently Asked Questions</span>
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">
                                Quick answers to common questions about publishing on Chronicle.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, idx) => {
                                const isOpen = openFaq === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden transition-all"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                                        >
                                            <span>{faq.q}</span>
                                            <FiChevronDown
                                                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                                                    isOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-4 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed animate-in fade-in duration-150">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
