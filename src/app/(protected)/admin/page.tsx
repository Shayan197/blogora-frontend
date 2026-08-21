'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiShield,
    FiUsers,
    FiFolder,
    FiTag,
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiX,
} from 'react-icons/fi';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import {
    useListCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '@/redux/services/api/categories/categoriesApi';
import {
    useListTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} from '@/redux/services/api/tags/tagsApi';
import {
    useListUsersQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
} from '@/redux/services/api/users/usersApi';
import type { Category, Tag, UserListItem } from '@/types/blog';

export const AdminConsolePage = (): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'tags'>('users');
    const [userSearch, setUserSearch] = useState('');

    // Categories Modal State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const [categoryColor, setCategoryColor] = useState('#3b82f6');
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    // Tags Modal State
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagDesc, setTagDesc] = useState('');
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);

    // RTK Queries & Mutations
    const { data: usersData, isLoading: isUsersLoading } = useListUsersQuery({
        search: userSearch || undefined,
        limit: 20,
    });
    const [updateRoleReq] = useUpdateUserRoleMutation();
    const [updateStatusReq] = useUpdateUserStatusMutation();

    const { data: categoriesData } = useListCategoriesQuery({
        includeInactive: true,
    });
    const [createCatReq] = useCreateCategoryMutation();
    const [updateCatReq] = useUpdateCategoryMutation();
    const [deleteCatReq] = useDeleteCategoryMutation();

    const { data: tagsData } = useListTagsQuery({ limit: 50 });
    const [createTagReq] = useCreateTagMutation();
    const [updateTagReq] = useUpdateTagMutation();
    const [deleteTagReq] = useDeleteTagMutation();

    const users = usersData?.data?.items ?? [];
    const categories = categoriesData?.data?.categories ?? [];
    const tags = tagsData?.data?.items ?? [];

    const handleRoleChange = async (userUuid: string, roleId: number) => {
        try {
            await updateRoleReq({ uuid: userUuid, data: { roleId } }).unwrap();
            toast.success('User role updated');
        } catch {
            toast.error('Failed to update user role');
        }
    };

    const handleStatusChange = async (
        userUuid: string,
        status: 'pending' | 'active' | 'blocked' | 'suspended',
    ) => {
        try {
            await updateStatusReq({ uuid: userUuid, data: { status } }).unwrap();
            toast.success(`User status changed to ${status}`);
        } catch {
            toast.error('Failed to update user status');
        }
    };

    // Category Handlers
    const handleOpenCategoryModal = (cat?: Category) => {
        if (cat) {
            setEditingCategory(cat);
            setCategoryName(cat.name);
            setCategoryDesc(cat.description ?? '');
            setCategoryColor(cat.color ?? '#3b82f6');
        } else {
            setEditingCategory(null);
            setCategoryName('');
            setCategoryDesc('');
            setCategoryColor('#3b82f6');
        }
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        try {
            if (editingCategory) {
                await updateCatReq({
                    uuid: editingCategory.uuid,
                    data: {
                        name: categoryName.trim(),
                        description: categoryDesc.trim() || undefined,
                        color: categoryColor,
                    },
                }).unwrap();
                toast.success('Category updated');
            } else {
                await createCatReq({
                    name: categoryName.trim(),
                    description: categoryDesc.trim() || undefined,
                    color: categoryColor,
                }).unwrap();
                toast.success('Category created');
            }
            setIsCategoryModalOpen(false);
        } catch {
            toast.error('Failed to save category');
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCatReq(categoryToDelete).unwrap();
            toast.success('Category deleted');
            setCategoryToDelete(null);
        } catch {
            toast.error('Cannot delete category with associated blogs.');
            setCategoryToDelete(null);
        }
    };

    // Tag Handlers
    const handleOpenTagModal = (t?: Tag) => {
        if (t) {
            setEditingTag(t);
            setTagName(t.name);
            setTagDesc(t.description ?? '');
        } else {
            setEditingTag(null);
            setTagName('');
            setTagDesc('');
        }
        setIsTagModalOpen(true);
    };

    const handleSaveTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagName.trim()) return;

        try {
            if (editingTag) {
                await updateTagReq({
                    uuid: editingTag.uuid,
                    data: {
                        name: tagName.trim(),
                        description: tagDesc.trim() || undefined,
                    },
                }).unwrap();
                toast.success('Tag updated');
            } else {
                await createTagReq({
                    name: tagName.trim(),
                    description: tagDesc.trim() || undefined,
                }).unwrap();
                toast.success('Tag created');
            }
            setIsTagModalOpen(false);
        } catch {
            toast.error('Failed to save tag');
        }
    };

    const handleDeleteTag = async () => {
        if (!tagToDelete) return;
        try {
            await deleteTagReq(tagToDelete).unwrap();
            toast.success('Tag deleted');
            setTagToDelete(null);
        } catch {
            toast.error('Failed to delete tag');
            setTagToDelete(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            {/* Confirm Category Delete */}
            <ConfirmModal
                isOpen={!!categoryToDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? Make sure no blogs are actively assigned."
                onConfirm={handleDeleteCategory}
                onCancel={() => setCategoryToDelete(null)}
            />

            {/* Confirm Tag Delete */}
            <ConfirmModal
                isOpen={!!tagToDelete}
                title="Delete Tag"
                description="Are you sure you want to delete this tag from the directory?"
                onConfirm={handleDeleteTag}
                onCancel={() => setTagToDelete(null)}
            />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                            <FiShield className="w-4 h-4" />
                            <span>System Administrator</span>
                        </div>
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                            Admin Governance Console
                        </h1>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            Manage platform members, assign role permissions, and govern taxonomy.
                        </p>
                    </div>
                </div>

                {/* Console Tabs */}
                <div className="flex items-center gap-6 border-b border-[var(--border-subtle)] text-sm font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className={`pb-3 flex items-center gap-2 transition-colors relative cursor-pointer ${
                            activeTab === 'users'
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                        }`}
                    >
                        <FiUsers className="w-4 h-4" />
                        <span>Users Directory ({users.length})</span>
                        {activeTab === 'users' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className={`pb-3 flex items-center gap-2 transition-colors relative cursor-pointer ${
                            activeTab === 'categories'
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                        }`}
                    >
                        <FiFolder className="w-4 h-4" />
                        <span>Categories ({categories.length})</span>
                        {activeTab === 'categories' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('tags')}
                        className={`pb-3 flex items-center gap-2 transition-colors relative cursor-pointer ${
                            activeTab === 'tags'
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                        }`}
                    >
                        <FiTag className="w-4 h-4" />
                        <span>Tags ({tags.length})</span>
                        {activeTab === 'tags' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full" />
                        )}
                    </button>
                </div>

                {/* Tab 1: Users Directory */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex items-center max-w-md relative">
                            <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
                            />
                            <FiSearch className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
                        </div>

                        {isUsersLoading ? (
                            <SkeletonLoader type="card" count={3} />
                        ) : (
                            <div className="overflow-x-auto rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
                                <table className="w-full text-left text-xs divide-y divide-[var(--border-subtle)]">
                                    <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-subtle)]">
                                        {users.map((u: UserListItem) => (
                                            <tr
                                                key={u.uuid}
                                                className="hover:bg-[var(--bg-surface-subtle)] transition-colors"
                                            >
                                                <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                                                    {u.firstName} {u.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--text-secondary)]">
                                                    {u.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={u.role?.id ?? 4}
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                u.uuid,
                                                                Number(e.target.value),
                                                            )
                                                        }
                                                        className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold"
                                                    >
                                                        <option value={1}>Super Admin</option>
                                                        <option value={2}>Admin</option>
                                                        <option value={3}>Editor</option>
                                                        <option value={4}>Author</option>
                                                        <option value={5}>Moderator</option>
                                                        <option value={6}>Subscriber</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={u.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                u.uuid,
                                                                e.target.value as
                                                                    | 'pending'
                                                                    | 'active'
                                                                    | 'blocked'
                                                                    | 'suspended',
                                                            )
                                                        }
                                                        className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="blocked">Blocked</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--text-muted)]">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Categories Management */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleOpenCategoryModal()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] shadow-sm cursor-pointer"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Create Category</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((c) => (
                                <div
                                    key={c.uuid}
                                    className="card-editorial p-6 space-y-3 flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-3.5 h-3.5 rounded-full"
                                                    style={{
                                                        backgroundColor: c.color || '#3b82f6',
                                                    }}
                                                />
                                                <h3 className="font-bold text-base text-[var(--text-primary)]">
                                                    {c.name}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)]">
                                                {c.blogsCount || 0} blogs
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                                            {c.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenCategoryModal(c)}
                                            className="p-1.5 text-xs text-[var(--text-secondary)] hover:text-blue-500 rounded-lg hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
                                        >
                                            <FiEdit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryToDelete(c.uuid)}
                                            className="p-1.5 text-xs text-[var(--text-secondary)] hover:text-rose-500 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                                        >
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Tags Management */}
                {activeTab === 'tags' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleOpenTagModal()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] shadow-sm cursor-pointer"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Create Tag</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tags.map((t) => (
                                <div
                                    key={t.uuid}
                                    className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 shadow-sm"
                                >
                                    <div className="space-y-0.5">
                                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                                            #{t.name}
                                        </span>
                                        <p className="text-[11px] text-[var(--text-muted)]">
                                            {t.usageCount} stories
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenTagModal(t)}
                                            className="p-1 text-[var(--text-muted)] hover:text-blue-500 cursor-pointer"
                                        >
                                            <FiEdit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTagToDelete(t.uuid)}
                                            className="p-1 text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                                        >
                                            <FiTrash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Create/Edit Modal */}
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="relative w-full max-w-md bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-6 sm:p-8 space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                    {editingCategory ? 'Edit Category' : 'New Category'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="p-1 rounded-full text-[var(--text-muted)] cursor-pointer"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCategory} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={categoryDesc}
                                        onChange={(e) => setCategoryDesc(e.target.value)}
                                        className="w-full p-3 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Color Accent
                                    </label>
                                    <input
                                        type="color"
                                        value={categoryColor}
                                        onChange={(e) => setCategoryColor(e.target.value)}
                                        className="w-12 h-8 rounded-lg cursor-pointer bg-transparent border border-[var(--border-subtle)]"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-full border border-[var(--border-subtle)] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 text-xs font-semibold rounded-full bg-[var(--accent-primary)] text-white cursor-pointer"
                                    >
                                        Save Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tag Create/Edit Modal */}
                {isTagModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="relative w-full max-w-md bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-6 sm:p-8 space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                    {editingTag ? 'Edit Tag' : 'New Tag'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsTagModalOpen(false)}
                                    className="p-1 rounded-full text-[var(--text-muted)] cursor-pointer"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTag} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Tag Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={tagName}
                                        onChange={(e) => setTagName(e.target.value)}
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={tagDesc}
                                        onChange={(e) => setTagDesc(e.target.value)}
                                        className="w-full p-3 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsTagModalOpen(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-full border border-[var(--border-subtle)] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 text-xs font-semibold rounded-full bg-[var(--accent-primary)] text-white cursor-pointer"
                                    >
                                        Save Tag
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminConsolePage;
