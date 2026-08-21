'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    FiArrowLeft,
    FiEye,
    FiEdit2,
    FiImage,
    FiTag,
    FiFolder,
    FiCheck,
    FiSave,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useGetBlogBySlugQuery, useUpdateBlogMutation } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useListTagsQuery } from '@/redux/services/api/tags/tagsApi';

import type { BlogStatus } from '@/types/blog';

export const EditStoryPage = (): React.JSX.Element => {
    const params = useParams();
    const uuid = params?.uuid as string;
    const router = useRouter();

    const { data: blogData, isLoading } = useGetBlogBySlugQuery(uuid, { skip: !uuid });
    const blog = blogData?.data?.blog;

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [coverImage, setCoverImage] = useState('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const { data: categoriesData } = useListCategoriesQuery();
    const { data: tagsData } = useListTagsQuery();
    const [updateBlogReq, { isLoading: isUpdating }] = useUpdateBlogMutation();

    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    useEffect(() => {
        if (blog) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(blog.title ?? '');
            setSubtitle(blog.subtitle ?? '');
            setContent(blog.content ?? '');
            setCategoryId(blog.category?.id ?? blog.categoryId ?? '');
            setCoverImage(blog.coverImage ?? '');
            setSelectedTagIds(blog.tags?.map((t) => t.id) ?? []);
        }
    }, [blog]);

    const handleTagToggle = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
        );
    };

    const handleUpdateStory = async (status?: BlogStatus) => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        try {
            await updateBlogReq({
                uuid,
                data: {
                    title: title.trim(),
                    subtitle: subtitle.trim() || undefined,
                    content: content.trim(),
                    categoryId: categoryId ? Number(categoryId) : undefined,
                    tagIds: selectedTagIds,
                    coverImage: coverImage.trim() || undefined,
                    status,
                },
            }).unwrap();

            toast.success('Story updated successfully!');
            router.push('/dashboard/stories');
        } catch {
            toast.error('Failed to update story');
        }
    };

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

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Top Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                    <Link
                        href="/dashboard/stories"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                        <span>Stories Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPreviewMode((p) => !p)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)]"
                        >
                            {isPreviewMode ? (
                                <FiEdit2 className="w-3.5 h-3.5" />
                            ) : (
                                <FiEye className="w-3.5 h-3.5" />
                            )}
                            <span>{isPreviewMode ? 'Editor' : 'Preview'}</span>
                        </button>

                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStory(blog?.status)}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] shadow-sm shadow-blue-500/20"
                        >
                            <FiSave className="w-3.5 h-3.5" />
                            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>

                {/* Editor or Preview Mode */}
                {isPreviewMode ? (
                    <div className="space-y-6 animate-in fade-in duration-150">
                        {coverImage && (
                            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)]">
                            {title || 'Untitled'}
                        </h1>
                        {subtitle && (
                            <p className="font-serif text-xl italic text-[var(--text-secondary)]">
                                {subtitle}
                            </p>
                        )}
                        <article className="prose prose-lg dark:prose-invert max-w-none font-serif-editorial text-[var(--text-primary)] whitespace-pre-wrap">
                            {content}
                        </article>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title..."
                            rows={2}
                            className="w-full font-serif text-3xl sm:text-5xl font-bold bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
                        />

                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Subtitle..."
                            className="w-full font-serif text-lg sm:text-2xl italic bg-transparent border-none focus:outline-none text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                        />

                        {/* Settings */}
                        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiFolder className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Category</span>
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value) || '')}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiTag className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Tags</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((t) => {
                                        const isSelected = selectedTagIds.includes(t.id);
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => handleTagToggle(t.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                                                }`}
                                            >
                                                {isSelected && <FiCheck className="w-3 h-3" />}
                                                <span>#{t.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiImage className="w-3.5 h-3.5 text-sky-500" />
                                    <span>Cover Image URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your story..."
                            rows={18}
                            className="w-full p-6 font-serif-editorial text-base sm:text-lg leading-relaxed rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] resize-y shadow-sm"
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EditStoryPage;
