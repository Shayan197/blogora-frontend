'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiShare2, FiCopy, FiCheck, FiTwitter, FiLinkedin, FiX } from 'react-icons/fi';

interface ShareModalProps {
    title: string;
    url?: string;
}

export const ShareModal = ({ title, url }: ShareModalProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? (url ?? window.location.href) : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setIsCopied(false), 2500);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title,
        )}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    };

    const handleLinkedinShare = () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl,
        )}`;
        window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Share story"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
            >
                <FiShare2 className="w-4 h-4" />
                <span>Share</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                    Share this Story
                                </h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    Spread ideas with your network
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close modal"
                                className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleTwitterShare}
                                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white font-semibold text-sm transition-all"
                            >
                                <FiTwitter className="w-4 h-4" />
                                <span>Twitter / X</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleLinkedinShare}
                                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-sm transition-all"
                            >
                                <FiLinkedin className="w-4 h-4" />
                                <span>LinkedIn</span>
                            </button>
                        </div>

                        {/* Copy Link Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                Story Link
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] select-all focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold text-xs transition-colors"
                                >
                                    {isCopied ? (
                                        <>
                                            <FiCheck className="w-3.5 h-3.5" />
                                            <span>Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiCopy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareModal;
