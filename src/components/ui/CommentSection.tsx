'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiCornerDownRight, FiTrash2, FiEdit2, FiSend } from 'react-icons/fi';
import { useAppSelector } from '@/redux/hooks';
import { useGetMeQuery } from '@/redux/services/api/auth/auth';
import {
    useGetBlogCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
} from '@/redux/services/api/comments/commentsApi';
import type { Comment } from '@/types/blog';

interface CommentSectionProps {
    blogUuid: string;
}

export const CommentSection = ({ blogUuid }: CommentSectionProps): React.JSX.Element => {
    const [commentText, setCommentText] = useState('');
    const [replyingToUuid, setReplyingToUuid] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [editingCommentUuid, setEditingCommentUuid] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const { data: authData } = useGetMeQuery(undefined, { skip: !isAuthenticated });
    const currentUser = authData?.data?.user;

    const { data: commentsData, isLoading } = useGetBlogCommentsQuery(blogUuid);
    const [createCommentReq, { isLoading: isPosting }] = useCreateCommentMutation();
    const [deleteCommentReq] = useDeleteCommentMutation();
    const [updateCommentReq] = useUpdateCommentMutation();

    const comments = commentsData?.data?.comments ?? [];

    const handlePostRootComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to post a comment');
            router.push('/login');
            return;
        }

        if (!commentText.trim()) return;

        try {
            await createCommentReq({
                blogUuid,
                data: { content: commentText.trim() },
            }).unwrap();
            setCommentText('');
            toast.success('Comment posted successfully');
        } catch {
            toast.error('Failed to post comment');
        }
    };

    const handlePostReply = async (parentUuid: string) => {
        if (!isAuthenticated) {
            toast.error('Please login to reply');
            router.push('/login');
            return;
        }

        if (!replyText.trim()) return;

        try {
            await createCommentReq({
                blogUuid,
                data: {
                    content: replyText.trim(),
                    parentCommentUuid: parentUuid,
                },
            }).unwrap();
            setReplyText('');
            setReplyingToUuid(null);
            toast.success('Reply posted successfully');
        } catch {
            toast.error('Failed to post reply');
        }
    };

    const handleSaveEdit = async (commentUuid: string) => {
        if (!editText.trim()) return;

        try {
            await updateCommentReq({
                uuid: commentUuid,
                data: { content: editText.trim() },
                blogUuid,
            }).unwrap();
            setEditingCommentUuid(null);
            setEditText('');
            toast.success('Comment updated');
        } catch {
            toast.error('Failed to update comment');
        }
    };

    const handleDelete = async (commentUuid: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteCommentReq({ uuid: commentUuid, blogUuid }).unwrap();
            toast.success('Comment removed');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    const renderCommentNode = (c: Comment, isReply = false) => {
        const authorName = c.user ? `${c.user.firstName} ${c.user.lastName}` : 'Community Member';
        const initial = authorName[0]?.toUpperCase() ?? 'U';
        const isOwner = Boolean(
            currentUser &&
            c.user &&
            ((currentUser.uuid && c.user.uuid === currentUser.uuid) ||
                String(c.user.id) === String(currentUser.id) ||
                c.user.uuid === String(currentUser.id)),
        );
        const formattedDate = new Date(c.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        const isEditing = editingCommentUuid === c.uuid;

        return (
            <div
                key={c.uuid}
                className={`p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 ${
                    isReply ? 'ml-6 sm:ml-10 border-l-2 border-l-blue-500/50' : ''
                }`}
            >
                {/* Author Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {initial}
                        </div>
                        <div>
                            {c.user?.uuid ? (
                                <Link
                                    href={`/author/${c.user.uuid}`}
                                    className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    {authorName}
                                </Link>
                            ) : (
                                <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    {authorName}
                                </span>
                            )}
                            <p className="text-[11px] text-[var(--text-muted)]">{formattedDate}</p>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCommentUuid(c.uuid);
                                    setEditText(c.content);
                                }}
                                aria-label="Edit comment"
                                className="p-1 text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                            >
                                <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(c.uuid)}
                                aria-label="Delete comment"
                                className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content or Edit Form */}
                {isEditing ? (
                    <div className="space-y-2 pt-1">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full p-3 text-sm rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setEditingCommentUuid(null)}
                                className="px-3 py-1 text-xs rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSaveEdit(c.uuid)}
                                className="px-3 py-1 text-xs rounded-lg bg-[var(--accent-primary)] text-white font-medium hover:bg-[var(--accent-primary-hover)]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                        {c.content}
                    </p>
                )}

                {/* Reply action (only on root comments) */}
                {!isReply && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                setReplyingToUuid(replyingToUuid === c.uuid ? null : c.uuid);
                                setReplyText('');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                            <FiCornerDownRight className="w-3.5 h-3.5" />
                            <span>Reply</span>
                        </button>
                    </div>
                )}

                {/* Reply Box */}
                {replyingToUuid === c.uuid && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2 animate-in fade-in duration-150">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${authorName}...`}
                            rows={2}
                            className="w-full p-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setReplyingToUuid(null)}
                                className="px-2.5 py-1 text-xs rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePostReply(c.uuid)}
                                className="px-3 py-1 text-xs rounded-lg bg-[var(--accent-primary)] text-white font-medium hover:bg-[var(--accent-primary-hover)]"
                            >
                                Post Reply
                            </button>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {c.replies && c.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                        {c.replies.map((reply) => renderCommentNode(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="space-y-8 pt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiMessageSquare className="w-5 h-5 text-[var(--accent-primary)]" />
                    <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                        Discussion ({comments.length})
                    </h3>
                </div>
            </div>

            {/* Comment Composer */}
            <form onSubmit={handlePostRootComment} className="card-editorial p-4 sm:p-6 space-y-3">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                        isAuthenticated
                            ? 'Share your thoughts, feedback, or questions...'
                            : 'Log in to join the conversation...'
                    }
                    disabled={!isAuthenticated || isPosting}
                    rows={3}
                    className="w-full p-3 text-sm rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
                />
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">
                        Markdown supported. Be respectful and constructive.
                    </span>
                    <button
                        type="submit"
                        disabled={!isAuthenticated || isPosting || !commentText.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
                    >
                        <FiSend className="w-3.5 h-3.5" />
                        <span>{isPosting ? 'Posting...' : 'Post Comment'}</span>
                    </button>
                </div>
            </form>

            {/* Comment Tree */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-28 rounded-2xl bg-[var(--bg-surface-subtle)] animate-pulse"
                        />
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-subtle)] space-y-2">
                    <FiMessageSquare className="w-8 h-8 mx-auto text-[var(--text-muted)] opacity-50" />
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                        No responses yet
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                        Be the first to share your thoughts on this story.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">{comments.map((c) => renderCommentNode(c))}</div>
            )}
        </section>
    );
};

export default CommentSection;
