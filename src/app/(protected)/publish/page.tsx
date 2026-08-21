'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiArrowLeft,
    FiEye,
    FiEdit2,
    FiImage,
    FiTag,
    FiFolder,
    FiCheck,
    FiClock,
    FiSave,
    FiSend,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { useCreateBlogMutation } from '@/redux/services/api/blogs/blogsApi';
import { useListCategoriesQuery } from '@/redux/services/api/categories/categoriesApi';
import { useListTagsQuery } from '@/redux/services/api/tags/tagsApi';

export const PublishPage = (): React.JSX.Element => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [coverImage, setCoverImage] = useState('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const { data: categoriesData } = useListCategoriesQuery();
    const { data: tagsData } = useListTagsQuery();
    const [createBlogReq, { isLoading: isCreating }] = useCreateBlogMutation();

    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    const handleTagToggle = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
        );
    };

    // Calculate approximate reading time
    const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const estimatedReadingTime = Math.max(1, Math.ceil(wordsCount / 200));

    const handleSaveStory = async (status: 'draft' | 'published') => {
        if (!title.trim()) {
            toast.error('Please enter a story title');
            return;
        }
        if (!content.trim()) {
            toast.error('Please write some content for your story');
            return;
        }
        if (!categoryId) {
            toast.error('Please choose a category');
            return;
        }

        try {
            const res = await createBlogReq({
                title: title.trim(),
                subtitle: subtitle.trim() || undefined,
                content: content.trim(),
                categoryId: Number(categoryId),
                tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
                coverImage: coverImage.trim() || undefined,
                status,
            }).unwrap();

            toast.success(
                status === 'published'
                    ? '🎉 Story published successfully!'
                    : 'Draft saved to your studio.',
            );

            if (res.data?.blog?.slug && status === 'published') {
                router.push(`/story/${res.data.blog.slug}`);
            } else {
                router.push('/dashboard/stories');
            }
        } catch {
            toast.error('Failed to create story. Please check the fields and try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Top Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                    <Link
                        href="/dashboard/stories"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5" />
                        <span>Stories Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPreviewMode((p) => !p)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                        >
                            {isPreviewMode ? (
                                <>
                                    <FiEdit2 className="w-3.5 h-3.5" />
                                    <span>Editor Mode</span>
                                </>
                            ) : (
                                <>
                                    <FiEye className="w-3.5 h-3.5" />
                                    <span>Preview Layout</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            disabled={isCreating}
                            onClick={() => handleSaveStory('draft')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                        >
                            <FiSave className="w-3.5 h-3.5" />
                            <span>Save Draft</span>
                        </button>

                        <button
                            type="button"
                            disabled={isCreating}
                            onClick={() => handleSaveStory('published')}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/25"
                        >
                            <FiSend className="w-3.5 h-3.5" />
                            <span>{isCreating ? 'Publishing...' : 'Publish Story'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Editor or Preview */}
                {isPreviewMode ? (
                    <div className="space-y-8 animate-in fade-in duration-150">
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-600 dark:text-blue-400">
                            <strong>Preview Mode:</strong> This is how your story will look to
                            readers once published.
                        </div>

                        {coverImage && (
                            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)]">
                                {title || 'Untitled Story'}
                            </h1>
                            {subtitle && (
                                <p className="font-serif text-xl italic text-[var(--text-secondary)]">
                                    {subtitle}
                                </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                                <span className="flex items-center gap-1">
                                    <FiClock className="w-3 h-3" />
                                    {estimatedReadingTime} min read
                                </span>
                            </div>
                        </div>

                        <article className="prose prose-lg dark:prose-invert max-w-none font-serif-editorial text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                            {content || 'Story content is currently empty...'}
                        </article>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Title Input */}
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title..."
                            rows={2}
                            className="w-full font-serif text-3xl sm:text-5xl font-bold bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
                        />

                        {/* Subtitle Input */}
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Write a clear subtitle or premise..."
                            className="w-full font-serif text-lg sm:text-2xl italic bg-transparent border-none focus:outline-none text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                        />

                        {/* Metadata Configuration Box */}
                        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-5">
                            <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                                Story Settings & Classification
                            </h3>

                            {/* Category Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiFolder className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Primary Category *</span>
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value) || '')}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tag Multi-Picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiTag className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Select Tags (up to 5)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((t) => {
                                        const isSelected = selectedTagIds.includes(t.id);
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => handleTagToggle(t.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                        : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-blue-400'
                                                }`}
                                            >
                                                {isSelected && <FiCheck className="w-3 h-3" />}
                                                <span>#{t.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cover Image URL */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiImage className="w-3.5 h-3.5 text-sky-500" />
                                    <span>Cover Image URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                />
                                {coverImage && (
                                    <div className="mt-2 w-48 aspect-video rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
                                        <img
                                            src={coverImage}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rich Content Textarea */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                                <span>Write your story (Markdown formatting supported)...</span>
                                <span>
                                    {wordsCount} words • ~{estimatedReadingTime} min read
                                </span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tell your story..."
                                rows={18}
                                className="w-full p-6 font-serif-editorial text-base sm:text-lg leading-relaxed rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-y shadow-sm"
                            />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PublishPage;
