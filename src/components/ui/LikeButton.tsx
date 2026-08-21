'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';
import { useAppSelector } from '@/redux/hooks';
import { useToggleLikeMutation } from '@/redux/services/api/blogs/blogsApi';

interface LikeButtonProps {
    blogUuid: string;
    initialLiked?: boolean;
    initialCount?: number;
    size?: 'sm' | 'md' | 'lg';
}

export const LikeButton = ({
    blogUuid,
    initialLiked = false,
    initialCount = 0,
    size = 'md',
}: LikeButtonProps): React.JSX.Element => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialCount);
    const [isAnimating, setIsAnimating] = useState(false);

    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [toggleLikeReq, { isLoading }] = useToggleLikeMutation();

    useEffect(() => {
        setIsLiked(initialLiked);
    }, [initialLiked]);

    useEffect(() => {
        setLikesCount(initialCount);
    }, [initialCount]);

    const handleToggle = async () => {
        if (!isAuthenticated) {
            toast.error('Please log in to like this story');
            router.push('/login');
            return;
        }

        if (isLoading) return;

        // Optimistic update
        const isPrevLiked = isLiked;
        const prevCount = likesCount;

        const isNextLiked = !isPrevLiked;
        const nextCount = isNextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

        setIsLiked(isNextLiked);
        setLikesCount(nextCount);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);

        try {
            const res = await toggleLikeReq(blogUuid).unwrap();
            if (res?.data) {
                setIsLiked(res.data.liked);
                setLikesCount(res.data.likesCount);
            }
        } catch {
            // Revert on failure
            setIsLiked(isPrevLiked);
            setLikesCount(prevCount);
            toast.error('Failed to update like status');
        }
    };

    const sizeClasses = {
        sm: 'px-2.5 py-1 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isLoading}
            aria-label={isLiked ? 'Unlike story' : 'Like story'}
            className={`inline-flex items-center rounded-full font-semibold transition-all duration-200 cursor-pointer border ${
                sizeClasses[size]
            } ${
                isLiked
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 shadow-sm'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-rose-300 hover:text-rose-500'
            } ${isAnimating ? 'scale-110' : 'scale-100'}`}
        >
            <FiHeart
                className={`${iconSizes[size]} transition-transform ${
                    isLiked ? 'fill-rose-500 text-rose-500' : ''
                } ${isAnimating ? 'scale-125 rotate-12' : ''}`}
            />
            <span>{likesCount}</span>
            <span className="hidden sm:inline text-xs font-normal opacity-80">
                {likesCount === 1 ? 'Clap' : 'Claps'}
            </span>
        </button>
    );
};

export default LikeButton;
