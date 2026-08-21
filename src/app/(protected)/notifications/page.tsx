'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiTrash2,
    FiHeart,
    FiMessageSquare,
    FiCornerDownRight,
    FiClock,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
} from '@/redux/services/api/notifications/notificationsApi';
import type { Notification, NotificationType } from '@/types/blog';

export const NotificationsPage = (): React.JSX.Element => {
    const [filterType, setFilterType] = useState<string>('all');

    const { data: notifsData, isLoading } = useGetNotificationsQuery({ limit: 30 });
    const [markAsReadReq] = useMarkAsReadMutation();
    const [markAllReadReq, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
    const [deleteNotifReq] = useDeleteNotificationMutation();

    const notifications = notifsData?.data?.items ?? [];
    const unreadCount = notifsData?.data?.unreadCount ?? 0;

    const filtered = notifications.filter((n: Notification) => {
        if (filterType === 'all') return true;
        if (filterType === 'unread') return !n.isRead;
        return n.type === filterType;
    });

    const handleMarkSingle = async (uuid: string) => {
        try {
            await markAsReadReq(uuid).unwrap();
        } catch {
            toast.error('Failed to mark notification');
        }
    };

    const handleMarkAll = async () => {
        try {
            await markAllReadReq().unwrap();
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark all notifications');
        }
    };

    const handleDelete = async (uuid: string) => {
        try {
            await deleteNotifReq(uuid).unwrap();
            toast.success('Notification removed');
        } catch {
            toast.error('Failed to delete notification');
        }
    };

    const getIconForType = (type: NotificationType) => {
        switch (type) {
            case 'like':
                return <FiHeart className="w-4 h-4 text-rose-500 fill-rose-500" />;
            case 'comment':
                return <FiMessageSquare className="w-4 h-4 text-blue-500" />;
            case 'reply':
                return <FiCornerDownRight className="w-4 h-4 text-indigo-500" />;
            default:
                return <FiBell className="w-4 h-4 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            Stay updated on reader claps, discussion comments, and community
                            interactions.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            disabled={isMarkingAll}
                            onClick={handleMarkAll}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                        >
                            <FiCheck className="w-3.5 h-3.5" />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    {[
                        { label: 'All Activity', value: 'all' },
                        { label: 'Unread', value: 'unread' },
                        { label: 'Claps', value: 'like' },
                        { label: 'Comments', value: 'comment' },
                        { label: 'Replies', value: 'reply' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setFilterType(tab.value)}
                            className={`px-3.5 py-1.5 rounded-full transition-colors border cursor-pointer ${
                                filterType === tab.value
                                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-20 rounded-2xl bg-[var(--bg-surface-subtle)] animate-pulse"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-2">
                        <FiBell className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-50" />
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                            No notifications in this view
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                            When readers interact with your stories or reply to your comments, they
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((n: Notification) => {
                            const formattedDate = new Date(n.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            );

                            return (
                                <div
                                    key={n.uuid}
                                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                                        n.isRead
                                            ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                                            : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex-shrink-0">
                                            {getIconForType(n.type)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs sm:text-sm text-[var(--text-primary)] font-medium leading-snug">
                                                {n.message}
                                            </p>
                                            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                {formattedDate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {!n.isRead && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkSingle(n.uuid)}
                                                className="p-1.5 text-xs text-[var(--text-muted)] hover:text-blue-500 rounded-lg hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
                                                aria-label="Mark read"
                                            >
                                                <FiCheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(n.uuid)}
                                            className="p-1.5 text-xs text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                                            aria-label="Delete notification"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default NotificationsPage;
