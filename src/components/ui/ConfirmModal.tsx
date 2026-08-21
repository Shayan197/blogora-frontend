'use client';

import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({
    isOpen,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = true,
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps): React.JSX.Element | null => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="fixed inset-0" onClick={onCancel} aria-hidden="true" />
            <div className="relative w-full max-w-md bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 space-y-5 z-10 animate-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                isDestructive
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : 'bg-blue-500/10 text-blue-500'
                            }`}
                        >
                            <FiAlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2 rounded-full text-xs font-semibold text-white transition-all shadow-sm ${
                            isDestructive
                                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] shadow-blue-500/20'
                        }`}
                    >
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
