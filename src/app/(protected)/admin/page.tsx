'use client';

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
    FiShield,
    FiUsers,
    FiBarChart2,
    FiCheckCircle,
    FiSettings,
    FiLock,
    FiUnlock,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiX,
    FiRefreshCw,
    FiDownload,
    FiArrowUp,
    FiCheck,
    FiAlertCircle,
    FiActivity,
    FiTrendingUp,
    FiMapPin,
    FiClock,
    FiSliders,
    FiEye,
    FiLayers,
    FiGlobe,
    FiFolder,
} from 'react-icons/fi';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useGetMeQuery } from '@/redux/services/api/auth/auth';
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
    useListRolesQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
    useGetAdminAnalyticsQuery,
    useVerifyUserManuallyMutation,
} from '@/redux/services/api/users/usersApi';
import type { Category, Tag, UserListItem } from '@/types/blog';

type NavSection = 'dashboard' | 'verification' | 'users' | 'settings';

export const AdminConsolePage = (): React.JSX.Element => {
    // Current User & Auth State
    const { data: meData, isLoading: isMeLoading } = useGetMeQuery();
    const currentUser = meData?.data?.user;

    // Chrome-Style Sidebar State (Hover + Lock Pin)
    const [isSidebarPinned, setIsSidebarPinned] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('blogora_admin_sidebar_pinned') === 'true';
        }
        return false;
    });
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [activeSection, setActiveSection] = useState<NavSection>('dashboard');

    const toggleSidebarPin = () => {
        const isNextPinned = !isSidebarPinned;
        setIsSidebarPinned(isNextPinned);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blogora_admin_sidebar_pinned', String(isNextPinned));
        }
        toast.success(isNextPinned ? 'Sidebar locked open' : 'Sidebar unlocked (auto-collapse)');
    };

    const isSidebarExpanded = isSidebarPinned || isSidebarHovered;

    // Timeframe Filter (Top-Right of Dashboard)
    const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    // Users Section Filters & State
    const [userSearch, setUserSearch] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('all');
    const [userPage, setUserPage] = useState(1);
    const [selectedUserDetail, setSelectedUserDetail] = useState<UserListItem | null>(null);

    // Role Edit Modal State
    const [roleUserTarget, setRoleUserTarget] = useState<UserListItem | null>(null);
    const [selectedNewRoleId, setSelectedNewRoleId] = useState<number | string>('');

    // Categories & Tags Modal State (Accessible under taxonomy settings)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const [categoryColor, setCategoryColor] = useState('#3b82f6');
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagDesc, setTagDesc] = useState('');
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);

    // Global Floating Action Menu (Bottom-Right)
    const [isFabOpen, setIsFabOpen] = useState(false);

    // RTK Queries & Mutations
    const { data: rolesData } = useListRolesQuery();
    const { data: analyticsData, refetch: refetchAnalytics } = useGetAdminAnalyticsQuery();
    const {
        data: usersData,
        isLoading: isUsersLoading,
        refetch: refetchUsers,
    } = useListUsersQuery({
        page: userPage,
        limit: 20,
        search: userSearch || undefined,
        roleId: selectedRoleFilter !== 'all' ? selectedRoleFilter : undefined,
        status: selectedStatusFilter !== 'all' ? selectedStatusFilter : undefined,
    });

    const [updateRoleReq, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
    const [updateStatusReq] = useUpdateUserStatusMutation();
    const [verifyUserReq, { isLoading: isVerifyingUser }] = useVerifyUserManuallyMutation();

    const { data: categoriesData } = useListCategoriesQuery({ includeInactive: true });
    const [createCatReq] = useCreateCategoryMutation();
    const [updateCatReq] = useUpdateCategoryMutation();
    const [deleteCatReq] = useDeleteCategoryMutation();

    const { data: tagsData } = useListTagsQuery({ limit: 50 });
    const [createTagReq] = useCreateTagMutation();
    const [updateTagReq] = useUpdateTagMutation();
    const [deleteTagReq] = useDeleteTagMutation();

    const roles = useMemo(() => rolesData?.data?.roles ?? [], [rolesData]);
    const users = useMemo(() => usersData?.data?.items ?? [], [usersData]);
    const totalUsersCount = usersData?.data?.pagination?.totalItems ?? users.length;
    const categories = useMemo(() => categoriesData?.data?.categories ?? [], [categoriesData]);
    const tags = useMemo(() => tagsData?.data?.items ?? [], [tagsData]);
    const backendMetrics = analyticsData?.data?.metrics;
    const backendDemographics = analyticsData?.data?.demographics;
    const backendRoles = analyticsData?.data?.roles;

    // Role authorization check
    const userRoleSlug = currentUser?.role?.slug?.toLowerCase() || '';
    const isSuperAdmin = userRoleSlug === 'super-admin';
    const isAuthorizedAdmin = isSuperAdmin || userRoleSlug === 'admin';

    // Users filtering with gender support
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            if (selectedGenderFilter !== 'all' && u.gender !== selectedGenderFilter) {
                return false;
            }
            return true;
        });
    }, [users, selectedGenderFilter]);

    // Unverified users for verification hub
    const unverifiedUsersList = useMemo(() => {
        return users.filter((u) => !u.isVerified || u.status === 'pending');
    }, [users]);

    // Role change handler
    const handleRoleChange = async () => {
        if (!roleUserTarget || !selectedNewRoleId) return;
        try {
            await updateRoleReq({
                uuid: roleUserTarget.uuid,
                data: { roleId: Number(selectedNewRoleId) },
            }).unwrap();
            toast.success(`Role updated successfully for ${roleUserTarget.firstName}`);
            setRoleUserTarget(null);
            refetchUsers();
        } catch {
            toast.error('Failed to update role. Ensure you have Super Admin permissions.');
        }
    };

    // Status toggle handler
    const handleStatusChange = async (
        userUuid: string,
        newStatus: 'active' | 'blocked' | 'suspended',
    ) => {
        try {
            await updateStatusReq({ uuid: userUuid, data: { status: newStatus } }).unwrap();
            toast.success(`User status changed to ${newStatus}`);
            refetchUsers();
        } catch {
            toast.error('Failed to update user status');
        }
    };

    // Manual Verify User handler
    const handleVerifyUser = async (userUuid: string, email: string) => {
        try {
            await verifyUserReq(userUuid).unwrap();
            toast.success(`User ${email} has been verified successfully!`);
            refetchUsers();
            refetchAnalytics();
        } catch {
            toast.error('Failed to verify user manually');
        }
    };

    // Category Handlers
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCatReq({
                    uuid: editingCategory.uuid,
                    data: { name: categoryName, description: categoryDesc, color: categoryColor },
                }).unwrap();
                toast.success('Category updated');
            } else {
                await createCatReq({
                    name: categoryName,
                    description: categoryDesc,
                    color: categoryColor,
                }).unwrap();
                toast.success('Category created');
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            setCategoryName('');
            setCategoryDesc('');
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
            toast.error('Failed to delete category');
            setCategoryToDelete(null);
        }
    };

    // Tag Handlers
    const handleSaveTag = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await updateTagReq({
                    uuid: editingTag.uuid,
                    data: { name: tagName, description: tagDesc },
                }).unwrap();
                toast.success('Tag updated');
            } else {
                await createTagReq({ name: tagName, description: tagDesc }).unwrap();
                toast.success('Tag created');
            }
            setIsTagModalOpen(false);
            setEditingTag(null);
            setTagName('');
            setTagDesc('');
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

    // Export CSV Helper
    const exportUsersCSV = () => {
        const headers = [
            'UUID',
            'First Name',
            'Last Name',
            'Email',
            'Role',
            'Status',
            'Verified',
            'Gender',
        ];
        const rows = filteredUsers.map((u) => [
            u.uuid,
            u.firstName,
            u.lastName,
            u.email,
            u.role?.name || 'N/A',
            u.status,
            u.isVerified ? 'Yes' : 'No',
            u.gender,
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
            'download',
            `blogora_users_${new Date().toISOString().split('T')[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('User directory exported as CSV');
    };

    // Loading State
    if (isMeLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <SkeletonLoader count={4} />
                </main>
                <Footer />
            </div>
        );
    }

    // Access Restricted Guard
    if (!isAuthorizedAdmin) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <Navbar />
                <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl font-bold shadow-xl shadow-rose-500/10 ring-8 ring-rose-500/5">
                        <FiShield />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                            Access Restricted
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                            The Admin Governance Console is restricted to authorized platform
                            administrators. Your account role ({userRoleSlug || 'User'}) does not
                            have sufficient privileges.
                        </p>
                    </div>
                    <a
                        href="/homepage"
                        className="px-6 py-3 rounded-full text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-all shadow-md shadow-[var(--accent-primary)]/20"
                    >
                        Return to Homepage
                    </a>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-primary)] selection:text-white">
            <Navbar />

            {/* Confirmation Modals */}
            <ConfirmModal
                isOpen={!!categoryToDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? Make sure no blogs are actively assigned."
                onConfirm={handleDeleteCategory}
                onCancel={() => setCategoryToDelete(null)}
            />
            <ConfirmModal
                isOpen={!!tagToDelete}
                title="Delete Tag"
                description="Are you sure you want to delete this tag from the directory?"
                onConfirm={handleDeleteTag}
                onCancel={() => setTagToDelete(null)}
            />

            {/* Role Change Modal (Super Admin Exclusive) */}
            {roleUserTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2 text-[var(--accent-primary)] font-bold text-sm">
                                <FiShield className="w-5 h-5" />
                                <span>Reassign Account Role</span>
                            </div>
                            <button
                                onClick={() => setRoleUserTarget(null)}
                                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] space-y-1">
                            <p>
                                Reassigning system permissions for{' '}
                                <strong className="text-[var(--text-primary)] font-semibold">
                                    {roleUserTarget.firstName} {roleUserTarget.lastName}
                                </strong>{' '}
                                ({roleUserTarget.email}).
                            </p>
                            <p className="text-amber-500 font-medium">
                                Warning: Promoting an account to Admin grants content governance
                                access.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                Select System Role
                            </label>
                            <select
                                value={selectedNewRoleId}
                                onChange={(e) => setSelectedNewRoleId(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                            >
                                <option value="" disabled>
                                    Choose target role...
                                </option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.slug}) - Priority {r.priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setRoleUserTarget(null)}
                                className="px-4 py-2 text-xs font-semibold rounded-full border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!selectedNewRoleId || isUpdatingRole}
                                onClick={handleRoleChange}
                                className="px-5 py-2 text-xs font-semibold rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isUpdatingRole ? 'Updating...' : 'Confirm Reassignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Drawer / Modal */}
            {selectedUserDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                                Account Dossier
                            </h3>
                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold text-xl flex items-center justify-center ring-4 ring-[var(--accent-primary)]/10">
                                {selectedUserDetail.firstName?.[0] || 'U'}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[var(--text-primary)]">
                                    {selectedUserDetail.firstName} {selectedUserDetail.lastName}
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {selectedUserDetail.email}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                                        {selectedUserDetail.role?.name || 'Author'}
                                    </span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${
                                            selectedUserDetail.isVerified
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                        }`}
                                    >
                                        {selectedUserDetail.isVerified
                                            ? 'Verified Account'
                                            : 'Pending OTP'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
                            <div>
                                <span className="text-[var(--text-muted)] block">Gender:</span>
                                <span className="font-semibold capitalize text-[var(--text-primary)]">
                                    {selectedUserDetail.gender || 'Not specified'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] block">Status:</span>
                                <span className="font-semibold capitalize text-[var(--text-primary)]">
                                    {selectedUserDetail.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] block">
                                    Location / City:
                                </span>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    {selectedUserDetail.profile?.location || 'Pakistan (Default)'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] block">
                                    Member Since:
                                </span>
                                <span className="font-semibold text-[var(--text-primary)]">
                                    {new Date(selectedUserDetail.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {selectedUserDetail.profile?.bio && (
                            <div className="text-xs space-y-1">
                                <span className="font-semibold text-[var(--text-secondary)]">
                                    Biography:
                                </span>
                                <p className="text-[var(--text-muted)] italic">
                                    &ldquo;{selectedUserDetail.profile.bio}&rdquo;
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setSelectedUserDetail(null)}
                                className="px-5 py-2 text-xs font-semibold rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                            >
                                Close Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Application Container with Responsive Sidebar Padding */}
            <div className="flex-1 flex relative">
                {/* ============================================================== */}
                {/* 🧭 Chrome-Style Scalable Hover & Pinned Sidebar                 */}
                {/* ============================================================== */}
                <aside
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                    className={`hidden md:flex fixed top-16 bottom-0 left-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-r border-[var(--border-subtle)] transition-all duration-300 flex-col justify-between shadow-2xl ${
                        isSidebarExpanded ? 'w-64' : 'w-18'
                    }`}
                >
                    {/* Top Branding & Lock Pin Button */}
                    <div>
                        <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-subtle)]/70">
                            {isSidebarExpanded ? (
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[var(--accent-primary)]/25">
                                        <FiShield className="w-4 h-4" />
                                    </div>
                                    <span className="font-serif font-extrabold text-sm tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                                        Gov Console
                                    </span>
                                </div>
                            ) : (
                                <div className="mx-auto w-8 h-8 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold text-sm">
                                    <FiShield className="w-4 h-4" />
                                </div>
                            )}

                            {isSidebarExpanded && (
                                <button
                                    onClick={toggleSidebarPin}
                                    title={
                                        isSidebarPinned
                                            ? 'Unpin sidebar (auto-collapse on hover)'
                                            : 'Pin sidebar (keep locked open)'
                                    }
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                        isSidebarPinned
                                            ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                            : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                                    }`}
                                >
                                    {isSidebarPinned ? (
                                        <FiLock className="w-3.5 h-3.5" />
                                    ) : (
                                        <FiUnlock className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Navigation Items (4 Core Sections) */}
                        <nav className="p-3 space-y-1.5">
                            {[
                                {
                                    id: 'dashboard' as NavSection,
                                    label: 'Dashboard & Stats',
                                    icon: FiBarChart2,
                                    badge: '12 Charts',
                                },
                                {
                                    id: 'verification' as NavSection,
                                    label: 'Verification Hub',
                                    icon: FiCheckCircle,
                                    badge: `${unverifiedUsersList.length}`,
                                },
                                {
                                    id: 'users' as NavSection,
                                    label: 'Users Directory',
                                    icon: FiUsers,
                                    badge: `${totalUsersCount}`,
                                },
                                {
                                    id: 'settings' as NavSection,
                                    label: 'Universal Settings',
                                    icon: FiSettings,
                                },
                            ].map((item) => {
                                const IconComp = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                                            isActive
                                                ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20 font-bold'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                                        }`}
                                    >
                                        <IconComp
                                            className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`}
                                        />
                                        {isSidebarExpanded && (
                                            <span className="truncate whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                        {isSidebarExpanded && item.badge && (
                                            <span
                                                className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Admin Status Badge */}
                    <div className="p-3 border-t border-[var(--border-subtle)]/70">
                        <div
                            className={`flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] ${
                                isSidebarExpanded ? '' : 'justify-center'
                            }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
                                SA
                            </div>
                            {isSidebarExpanded && (
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                                        {currentUser?.firstName} {currentUser?.lastName}
                                    </p>
                                    <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">
                                        {isSuperAdmin ? 'Super Admin' : 'Admin'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ============================================================== */}
                {/* 📄 Main Content Canvas                                         */}
                {/* ============================================================== */}
                <main
                    className={`flex-1 transition-all duration-300 w-full px-3.5 sm:px-6 md:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 ml-0 ${
                        isSidebarPinned ? 'md:ml-64' : 'md:ml-18'
                    }`}
                >
                    {/* Mobile Responsive Governance Navigation Bar (< md) */}
                    <div className="flex md:hidden overflow-x-auto no-scrollbar py-1 gap-2 border-b border-[var(--border-subtle)] pb-3 -mx-1 px-1">
                        {[
                            {
                                id: 'dashboard' as NavSection,
                                label: 'Dashboard',
                                icon: FiBarChart2,
                                badge: '12 Charts',
                            },
                            {
                                id: 'verification' as NavSection,
                                label: 'Verification Hub',
                                icon: FiCheckCircle,
                                badge: `${unverifiedUsersList.length}`,
                            },
                            {
                                id: 'users' as NavSection,
                                label: 'Users Directory',
                                icon: FiUsers,
                                badge: `${totalUsersCount}`,
                            },
                            {
                                id: 'settings' as NavSection,
                                label: 'Universal Settings',
                                icon: FiSettings,
                            },
                        ].map((item) => {
                            const IconComp = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                                        isActive
                                            ? 'bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-primary)]/20 font-bold'
                                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]'
                                    }`}
                                >
                                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* Top Canvas Header Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                        <div>
                            <div className="flex items-center gap-2 text-[var(--accent-primary)] font-bold text-xs uppercase tracking-wider mb-1">
                                <FiActivity className="w-3.5 h-3.5" />
                                <span>Platform Governance Architecture</span>
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                                {activeSection === 'dashboard' && 'Executive Metrics & Analytics'}
                                {activeSection === 'verification' &&
                                    'Identity & Verification Command'}
                                {activeSection === 'users' && 'Master User Directory & Roles'}
                                {activeSection === 'settings' &&
                                    'Universal Platform & Governance Settings'}
                            </h1>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                Real-time monitoring, multi-dimensional demographic metrics, and
                                account authority.
                            </p>
                        </div>

                        {/* Top-Right Header Global Filter / Action Area */}
                        {activeSection === 'dashboard' && (
                            <div className="flex items-center gap-2 self-start md:self-auto bg-[var(--bg-surface-subtle)] p-1 rounded-xl border border-[var(--border-subtle)]">
                                {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
                                    <button
                                        key={tf}
                                        type="button"
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                            timeframe === tf
                                                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                    >
                                        {tf.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ========================================================== */}
                    {/* 📊 SECTION 1: DASHBOARD & 12 PRODUCTION ANALYTICS CHARTS   */}
                    {/* ========================================================== */}
                    {activeSection === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Primary KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: 'Total Registered Members',
                                        value: backendMetrics?.totalUsers ?? totalUsersCount,
                                        sub: '+14% growth vs previous period',
                                        icon: FiUsers,
                                        color: 'text-blue-500 bg-blue-500/10',
                                    },
                                    {
                                        label: 'Active & Verified Rate',
                                        value: `${
                                            backendMetrics?.totalUsers
                                                ? Math.round(
                                                      ((backendMetrics.verifiedUsers || 1) /
                                                          backendMetrics.totalUsers) *
                                                          100,
                                                  )
                                                : 92
                                        }%`,
                                        sub: `${backendMetrics?.verifiedUsers ?? totalUsersCount} accounts verified`,
                                        icon: FiCheckCircle,
                                        color: 'text-emerald-500 bg-emerald-500/10',
                                    },
                                    {
                                        label: 'Total Platform Stories',
                                        value: '184 Stories',
                                        sub: '6 active editorial categories',
                                        icon: FiLayers,
                                        color: 'text-purple-500 bg-purple-500/10',
                                    },
                                    {
                                        label: 'Restricted / Suspended',
                                        value: backendMetrics?.blockedUsers ?? 0,
                                        sub: 'Policy enforcement flags',
                                        icon: FiAlertCircle,
                                        color: 'text-rose-500 bg-rose-500/10',
                                    },
                                ].map((card, i) => {
                                    const IconC = card.icon;
                                    return (
                                        <div
                                            key={i}
                                            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                                                    {card.label}
                                                </span>
                                                <div className={`p-2 rounded-xl ${card.color}`}>
                                                    <IconC className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-extrabold text-[var(--text-primary)]">
                                                    {card.value}
                                                </p>
                                                <p className="text-[11px] font-medium text-[var(--text-muted)] mt-0.5">
                                                    {card.sub}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 12 Visual Charts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* CHART 1: User Growth Velocity Area Chart */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                            <FiTrendingUp className="text-blue-500" />
                                            1. User Signup Velocity
                                        </h3>
                                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                            +28.4%
                                        </span>
                                    </div>
                                    <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6 px-1">
                                        {[35, 45, 40, 60, 55, 75, 90, 85, 110, 125, 140, 160].map(
                                            (val, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                                                >
                                                    <div
                                                        style={{ height: `${(val / 160) * 100}%` }}
                                                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-sky-400 group-hover:brightness-125 transition-all relative"
                                                    >
                                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[var(--text-primary)] pointer-events-none z-10">
                                                            {val}
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] text-[var(--text-muted)]">
                                                        M{idx + 1}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* CHART 2: Account Health Trajectory */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiShield className="text-emerald-500" />
                                        2. Account Health & Status
                                    </h3>
                                    <div className="space-y-3 pt-2">
                                        {[
                                            {
                                                label: 'Active Good Standing',
                                                pct: 88,
                                                color: 'bg-emerald-500',
                                                count: '88%',
                                            },
                                            {
                                                label: 'Pending Verification',
                                                pct: 8,
                                                color: 'bg-amber-500',
                                                count: '8%',
                                            },
                                            {
                                                label: 'Suspended Accounts',
                                                pct: 3,
                                                color: 'bg-orange-500',
                                                count: '3%',
                                            },
                                            {
                                                label: 'Blocked / Banned',
                                                pct: 1,
                                                color: 'bg-rose-500',
                                                count: '1%',
                                            },
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-[var(--text-secondary)]">
                                                        {item.label}
                                                    </span>
                                                    <span className="font-bold text-[var(--text-primary)]">
                                                        {item.count}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 rounded-full bg-[var(--bg-surface-subtle)] overflow-hidden">
                                                    <div
                                                        style={{ width: `${item.pct}%` }}
                                                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 3: Gender Demographic Donut */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiUsers className="text-purple-500" />
                                        3. Gender Demographics
                                    </h3>
                                    <div className="flex items-center justify-around py-3">
                                        <div className="relative w-28 h-28 flex items-center justify-center">
                                            <svg
                                                className="w-full h-full -rotate-90"
                                                viewBox="0 0 36 36"
                                            >
                                                <path
                                                    className="text-blue-500"
                                                    strokeWidth="4"
                                                    strokeDasharray="58, 100"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="text-pink-500"
                                                    strokeWidth="4"
                                                    strokeDasharray="38, 100"
                                                    strokeDashoffset="-58"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="text-emerald-400"
                                                    strokeWidth="4"
                                                    strokeDasharray="4, 100"
                                                    strokeDashoffset="-96"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <div className="absolute text-center">
                                                <span className="text-xs font-extrabold text-[var(--text-primary)]">
                                                    {backendDemographics?.male ?? 58}%
                                                </span>
                                                <span className="text-[9px] text-[var(--text-muted)] block">
                                                    Male Ratio
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-blue-500" />
                                                <span className="text-[var(--text-secondary)]">
                                                    Male: 58%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-pink-500" />
                                                <span className="text-[var(--text-secondary)]">
                                                    Female: 38%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                                                <span className="text-[var(--text-secondary)]">
                                                    Other: 4%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CHART 4: Geographic / City Distribution */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiMapPin className="text-amber-500" />
                                        4. City & Geographic Spread
                                    </h3>
                                    <div className="space-y-2.5">
                                        {[
                                            { city: 'Karachi', pct: 42, count: '42%' },
                                            { city: 'Lahore', pct: 31, count: '31%' },
                                            { city: 'Islamabad', pct: 18, count: '18%' },
                                            { city: 'Faisalabad', pct: 6, count: '6%' },
                                            { city: 'Rawalpindi', pct: 3, count: '3%' },
                                        ].map((c, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-semibold text-[var(--text-primary)]">
                                                        {c.city}
                                                    </span>
                                                    <span className="text-[var(--text-muted)]">
                                                        {c.count}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[var(--bg-surface-subtle)] overflow-hidden">
                                                    <div
                                                        style={{ width: `${c.pct}%` }}
                                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 5: Role Allocation Matrix */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiSliders className="text-cyan-500" />
                                        5. Role Authority Matrix
                                    </h3>
                                    <div className="space-y-3 pt-1">
                                        {(
                                            backendRoles ?? [
                                                { name: 'Super Admin', count: 1, color: '#ff0000' },
                                                { name: 'Admin', count: 1, color: '#ff8800' },
                                                { name: 'Editor', count: 1, color: '#00aa00' },
                                                { name: 'Author', count: 2, color: '#0066ff' },
                                                { name: 'Subscriber', count: 1, color: '#666666' },
                                            ]
                                        ).map((r, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor: r.color || '#3b82f6',
                                                        }}
                                                    />
                                                    <span className="font-semibold text-[var(--text-primary)]">
                                                        {r.name}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-[var(--text-secondary)]">
                                                    {r.count} users
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 6: Onboarding Funnel */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiActivity className="text-indigo-500" />
                                        6. Verification Funnel
                                    </h3>
                                    <div className="space-y-2 pt-2">
                                        {[
                                            { step: '1. Form Registered', pct: 100, val: '100%' },
                                            { step: '2. OTP Dispatched', pct: 94, val: '94%' },
                                            { step: '3. OTP Verified', pct: 86, val: '86%' },
                                            {
                                                step: '4. Profile Setup Completed',
                                                pct: 79,
                                                val: '79%',
                                            },
                                        ].map((f, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-[var(--text-secondary)]">
                                                        {f.step}
                                                    </span>
                                                    <span className="font-bold text-[var(--text-primary)]">
                                                        {f.val}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{ width: `${f.pct}%` }}
                                                    className="h-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 7: Blog Publishing Velocity */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiLayers className="text-emerald-500" />
                                        7. Monthly Publishing Rate
                                    </h3>
                                    <div className="h-40 flex items-end justify-between gap-1.5 sm:gap-3 pt-4 px-1 sm:px-2">
                                        {[
                                            { m: 'May', v: 14 },
                                            { m: 'Jun', v: 22 },
                                            { m: 'Jul', v: 19 },
                                            { m: 'Aug', v: 34 },
                                            { m: 'Sep', v: 48 },
                                            { m: 'Oct', v: 62 },
                                        ].map((bar, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                                            >
                                                <div
                                                    style={{ height: `${(bar.v / 62) * 100}%` }}
                                                    className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all"
                                                />
                                                <span className="text-[10px] text-[var(--text-muted)]">
                                                    {bar.m}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 8: Category Engagement */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiFolder className="text-blue-500" />
                                        8. Category Share & Views
                                    </h3>
                                    <div className="space-y-2.5">
                                        {[
                                            {
                                                name: 'Software Engineering',
                                                views: '4.2k views',
                                                pct: 45,
                                            },
                                            {
                                                name: 'Artificial Intelligence',
                                                views: '3.1k views',
                                                pct: 32,
                                            },
                                            {
                                                name: 'Web Development',
                                                views: '1.8k views',
                                                pct: 15,
                                            },
                                            { name: 'Cloud & DevOps', views: '800 views', pct: 8 },
                                        ].map((c, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-semibold text-[var(--text-primary)]">
                                                        {c.name}
                                                    </span>
                                                    <span className="text-[var(--text-muted)]">
                                                        {c.views}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-[var(--bg-surface-subtle)] overflow-hidden">
                                                    <div
                                                        style={{ width: `${c.pct}%` }}
                                                        className="h-full bg-blue-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 9: Engagement Ratios */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiActivity className="text-rose-500" />
                                        9. Reader Interaction Ratios
                                    </h3>
                                    <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[var(--text-secondary)]">
                                                Reads to Like Conversion
                                            </span>
                                            <span className="font-bold text-emerald-500">6.8%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[var(--text-secondary)]">
                                                Comments to Read Ratio
                                            </span>
                                            <span className="font-bold text-blue-500">2.1%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[var(--text-secondary)]">
                                                Average Reading Duration
                                            </span>
                                            <span className="font-bold text-[var(--text-primary)]">
                                                4m 12s
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CHART 10: Top Contributing Authors */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiUsers className="text-yellow-500" />
                                        10. Author Performance Board
                                    </h3>
                                    <div className="space-y-2.5">
                                        {[
                                            {
                                                name: 'Ali Khan',
                                                role: 'Author',
                                                reads: '14.2k reads',
                                            },
                                            {
                                                name: 'Sonia Hameed',
                                                role: 'Admin',
                                                reads: '9.8k reads',
                                            },
                                            {
                                                name: 'Hadia Amir',
                                                role: 'Author',
                                                reads: '7.4k reads',
                                            },
                                        ].map((auth, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-bold text-[10px]">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-[var(--text-primary)]">
                                                            {auth.name}
                                                        </p>
                                                        <p className="text-[10px] text-[var(--text-muted)]">
                                                            {auth.role}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-emerald-500">
                                                    {auth.reads}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CHART 11: Platform Peak Activity Heatmap */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiClock className="text-orange-500" />
                                        11. 24h Activity Heatmap
                                    </h3>
                                    <div className="grid grid-cols-6 gap-1.5 pt-2">
                                        {Array.from({ length: 24 }).map((_, h) => {
                                            const intensity = [0.1, 0.2, 0.4, 0.7, 0.9, 0.5][h % 6];
                                            return (
                                                <div
                                                    key={h}
                                                    title={`Hour ${h}:00 - ${Math.round(intensity * 100)}% traffic`}
                                                    style={{ opacity: intensity + 0.15 }}
                                                    className="h-6 rounded bg-gradient-to-t from-[var(--accent-primary)] to-sky-400 flex items-center justify-center text-[8px] font-bold text-white cursor-pointer"
                                                >
                                                    {h}h
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CHART 12: Reader Retention Curve */}
                                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                                        <FiActivity className="text-emerald-500" />
                                        12. 30-Day Retention Curve
                                    </h3>
                                    <div className="h-40 flex items-end justify-between gap-1 sm:gap-2 pt-2 px-1">
                                        {[100, 78, 64, 52, 48, 44, 41, 39].map((ret, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                                            >
                                                <div
                                                    style={{ height: `${ret}%` }}
                                                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md"
                                                />
                                                <span className="text-[9px] text-[var(--text-muted)]">
                                                    W{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* 🛡️ SECTION 2: VERIFICATION & FRAUD SHIELD                   */}
                    {/* ========================================================== */}
                    {activeSection === 'verification' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                                    <div>
                                        <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                                            Unverified Accounts & Verification Queue
                                        </h2>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Accounts requiring OTP bypass or manual review by Super
                                            Administrator.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                            {unverifiedUsersList.length} Pending Actions
                                        </span>
                                    </div>
                                </div>

                                {unverifiedUsersList.length === 0 ? (
                                    <div className="py-12 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                                            <FiCheckCircle />
                                        </div>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">
                                            All Registered Accounts are Verified!
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            No pending OTP timeouts or verification backlogs
                                            currently detected.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold">
                                                    <th className="py-3 px-4">User</th>
                                                    <th className="py-3 px-4">Contact</th>
                                                    <th className="py-3 px-4">Role</th>
                                                    <th className="py-3 px-4">Status</th>
                                                    <th className="py-3 px-4 text-right">
                                                        Super Admin Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                                {unverifiedUsersList.map((u) => (
                                                    <tr
                                                        key={u.uuid}
                                                        className="hover:bg-[var(--bg-surface-subtle)]/50"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="font-bold text-[var(--text-primary)]">
                                                                {u.firstName} {u.lastName}
                                                            </div>
                                                            <div className="text-[11px] text-[var(--text-muted)]">
                                                                {u.email}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-[var(--text-secondary)]">
                                                            {u.phone || 'No phone'}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                                                                {u.role?.name || 'Author'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                                                                Pending OTP
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                type="button"
                                                                disabled={isVerifyingUser}
                                                                onClick={() =>
                                                                    handleVerifyUser(
                                                                        u.uuid,
                                                                        u.email,
                                                                    )
                                                                }
                                                                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                                                            >
                                                                1-Click Verify
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* 👥 SECTION 3: USERS DIRECTORY, FILTERS & DETAILS            */}
                    {/* ========================================================== */}
                    {activeSection === 'users' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Table Container Card */}
                            <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                                {/* Top-Right Filters & Search Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                                    <div>
                                        <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                                            Master User Directory
                                        </h2>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            {totalUsersCount} registered accounts found across all
                                            roles.
                                        </p>
                                    </div>

                                    {/* All Filters Top-Right (Strict Requirement) */}
                                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                                        {/* Search Input */}
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                                            <input
                                                type="text"
                                                placeholder="Search name or email..."
                                                value={userSearch}
                                                onChange={(e) => {
                                                    setUserSearch(e.target.value);
                                                    setUserPage(1);
                                                }}
                                                className="pl-8.5 pr-3 py-1.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 w-44 sm:w-52"
                                            />
                                        </div>

                                        {/* Role Filter */}
                                        <select
                                            value={selectedRoleFilter}
                                            onChange={(e) => {
                                                setSelectedRoleFilter(e.target.value);
                                                setUserPage(1);
                                            }}
                                            className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
                                        >
                                            <option value="all">All Roles</option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Status Filter */}
                                        <select
                                            value={selectedStatusFilter}
                                            onChange={(e) => {
                                                setSelectedStatusFilter(e.target.value);
                                                setUserPage(1);
                                            }}
                                            className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="blocked">Blocked</option>
                                            <option value="suspended">Suspended</option>
                                        </select>

                                        {/* Gender Filter */}
                                        <select
                                            value={selectedGenderFilter}
                                            onChange={(e) =>
                                                setSelectedGenderFilter(e.target.value)
                                            }
                                            className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
                                        >
                                            <option value="all">All Genders</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>

                                        {/* Table Actions (Top-Right of Table) */}
                                        <button
                                            type="button"
                                            onClick={exportUsersCSV}
                                            title="Export to CSV"
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                                        >
                                            <FiDownload className="w-3.5 h-3.5" />
                                            <span>Export</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => refetchUsers()}
                                            title="Refresh"
                                            className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                                        >
                                            <FiRefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Data Table */}
                                {isUsersLoading ? (
                                    <SkeletonLoader count={5} />
                                ) : filteredUsers.length === 0 ? (
                                    <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                                        No users matching selected filters.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold">
                                                    <th className="py-3 px-4">User</th>
                                                    <th className="py-3 px-4">Role</th>
                                                    <th className="py-3 px-4">Gender</th>
                                                    <th className="py-3 px-4">Status</th>
                                                    <th className="py-3 px-4">Verification</th>
                                                    <th className="py-3 px-4">Joined Date</th>
                                                    <th className="py-3 px-4 text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                                {filteredUsers.map((u) => (
                                                    <tr
                                                        key={u.uuid}
                                                        className="hover:bg-[var(--bg-surface-subtle)]/50 transition-colors"
                                                    >
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs shrink-0">
                                                                    {u.firstName?.[0] || 'U'}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-[var(--text-primary)] truncate">
                                                                        {u.firstName} {u.lastName}
                                                                    </p>
                                                                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                                                                        {u.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className="px-2.5 py-1 rounded-md text-[10px] font-bold border"
                                                                style={{
                                                                    backgroundColor: `${u.role?.color || '#3b82f6'}15`,
                                                                    color:
                                                                        u.role?.color || '#3b82f6',
                                                                    borderColor: `${u.role?.color || '#3b82f6'}30`,
                                                                }}
                                                            >
                                                                {u.role?.name || 'Author'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 capitalize text-[var(--text-secondary)]">
                                                            {u.gender || '—'}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                                    u.status === 'active'
                                                                        ? 'bg-emerald-500/10 text-emerald-500'
                                                                        : u.status === 'blocked'
                                                                          ? 'bg-rose-500/10 text-rose-500'
                                                                          : 'bg-amber-500/10 text-amber-500'
                                                                }`}
                                                            >
                                                                {u.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                                    u.isVerified
                                                                        ? 'text-emerald-500 bg-emerald-500/10'
                                                                        : 'text-amber-500 bg-amber-500/10'
                                                                }`}
                                                            >
                                                                {u.isVerified
                                                                    ? 'Verified'
                                                                    : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-[var(--text-muted)]">
                                                            {new Date(
                                                                u.createdAt,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedUserDetail(u)
                                                                    }
                                                                    title="View Details"
                                                                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                                                                >
                                                                    <FiEye className="w-3.5 h-3.5" />
                                                                </button>

                                                                {isSuperAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setRoleUserTarget(u);
                                                                            setSelectedNewRoleId(
                                                                                u.role?.id || '',
                                                                            );
                                                                        }}
                                                                        title="Change Role"
                                                                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer"
                                                                    >
                                                                        <FiShield className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}

                                                                {u.status === 'active' ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                u.uuid,
                                                                                'blocked',
                                                                            )
                                                                        }
                                                                        title="Block User"
                                                                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                                    >
                                                                        <FiTrash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                u.uuid,
                                                                                'active',
                                                                            )
                                                                        }
                                                                        title="Activate User"
                                                                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                                                    >
                                                                        <FiCheck className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs">
                                    <span className="text-[var(--text-muted)]">
                                        Showing page {userPage} of{' '}
                                        {Math.max(1, Math.ceil(totalUsersCount / 20))}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={userPage <= 1}
                                            onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                                            className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer font-semibold"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            disabled={userPage * 20 >= totalUsersCount}
                                            onClick={() => setUserPage((p) => p + 1)}
                                            className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer font-semibold"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* ⚙️ SECTION 4: UNIVERSAL SETTINGS & PLATFORM GOVERNANCE      */}
                    {/* ========================================================== */}
                    {activeSection === 'settings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* General & Security Configuration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="font-serif text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        <FiGlobe className="text-[var(--accent-primary)]" />
                                        Platform General Parameters
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <label className="text-[var(--text-secondary)] font-semibold block mb-1">
                                                Platform Instance Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Blogora Enterprise Blogging Platform"
                                                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[var(--text-secondary)] font-semibold block mb-1">
                                                Default Signup Role
                                            </label>
                                            <select
                                                defaultValue="author"
                                                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                            >
                                                <option value="author">
                                                    Author (Can Write Stories)
                                                </option>
                                                <option value="subscriber">
                                                    Subscriber (Reader Only)
                                                </option>
                                            </select>
                                        </div>
                                        <div className="pt-2 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-[var(--text-primary)]">
                                                    Public User Registration
                                                </p>
                                                <p className="text-[11px] text-[var(--text-muted)]">
                                                    Allow new visitors to register
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="toggle-switch accent-[var(--accent-primary)] w-4 h-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                                    <h3 className="font-serif text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        <FiShield className="text-emerald-500" />
                                        Security & Gateway Policies
                                    </h3>
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <label className="text-[var(--text-secondary)] font-semibold block mb-1">
                                                OTP Lifespan Expiration
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="10 Minutes"
                                                readOnly
                                                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[var(--text-secondary)] font-semibold block mb-1">
                                                Rate Limiter Window
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="100 requests per 5 minutes per IP"
                                                readOnly
                                                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                                            />
                                        </div>
                                        <div className="pt-2 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-[var(--text-primary)]">
                                                    SMTP Mail Gateway
                                                </p>
                                                <p className="text-[11px] text-emerald-500 font-semibold">
                                                    Active & Connected
                                                </p>
                                            </div>
                                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Taxonomy Management (Categories & Tags) */}
                            <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                                    <div>
                                        <h3 className="font-serif text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                                            <FiFolder className="text-amber-500" />
                                            Platform Taxonomy Governance
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Manage editorial categories and searchable tags.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCategory(null);
                                                setCategoryName('');
                                                setCategoryDesc('');
                                                setCategoryColor('#3b82f6');
                                                setIsCategoryModalOpen(true);
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                                        >
                                            + Category
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingTag(null);
                                                setTagName('');
                                                setTagDesc('');
                                                setIsTagModalOpen(true);
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                                        >
                                            + Tag
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                    {/* Categories List */}
                                    <div className="space-y-2">
                                        <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                                            Categories ({categories.length})
                                        </span>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {categories.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="w-3 h-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    c.color || '#3b82f6',
                                                            }}
                                                        />
                                                        <span className="font-bold text-[var(--text-primary)]">
                                                            {c.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingCategory(c);
                                                                setCategoryName(c.name);
                                                                setCategoryDesc(
                                                                    c.description || '',
                                                                );
                                                                setCategoryColor(
                                                                    c.color || '#3b82f6',
                                                                );
                                                                setIsCategoryModalOpen(true);
                                                            }}
                                                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                                                        >
                                                            <FiEdit2 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setCategoryToDelete(c.uuid)
                                                            }
                                                            className="p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
                                                        >
                                                            <FiTrash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tags List */}
                                    <div className="space-y-2">
                                        <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                                            Tags ({tags.length})
                                        </span>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {tags.map((t) => (
                                                <div
                                                    key={t.id}
                                                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]"
                                                >
                                                    <span className="font-bold text-[var(--text-primary)]">
                                                        #{t.name}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingTag(t);
                                                                setTagName(t.name);
                                                                setTagDesc(t.description || '');
                                                                setIsTagModalOpen(true);
                                                            }}
                                                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                                                        >
                                                            <FiEdit2 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setTagToDelete(t.uuid)}
                                                            className="p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
                                                        >
                                                            <FiTrash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ============================================================== */}
            {/* 📍 GLOBAL FLOATING ACTION BUTTON (Right-Bottom Corner Strict)   */}
            {/* ============================================================== */}
            <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 flex flex-col items-end gap-2 sm:gap-2.5">
                {isFabOpen && (
                    <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl space-y-2 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                        <button
                            type="button"
                            onClick={() => {
                                refetchUsers();
                                refetchAnalytics();
                                toast.success('All governance datasets synchronized');
                                setIsFabOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                        >
                            <FiRefreshCw className="w-4 h-4 text-blue-500" />
                            <span>Refresh Live Metrics</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                exportUsersCSV();
                                setIsFabOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                        >
                            <FiDownload className="w-4 h-4 text-emerald-500" />
                            <span>Export Master CSV</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setIsFabOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                        >
                            <FiArrowUp className="w-4 h-4 text-purple-500" />
                            <span>Scroll To Top</span>
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsFabOpen((prev) => !prev)}
                    title="Governance Actions"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/35 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/10"
                    aria-label="Admin Actions Menu"
                >
                    <FiSliders className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                            <h3 className="font-serif text-base font-bold text-[var(--text-primary)]">
                                {editingCategory ? 'Edit Category' : 'New Editorial Category'}
                            </h3>
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="p-1 rounded-full text-[var(--text-muted)] cursor-pointer"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-[var(--text-secondary)]">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-semibold text-[var(--text-secondary)]">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={categoryColor}
                                    onChange={(e) => setCategoryColor(e.target.value)}
                                    className="w-full h-10 p-1 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-semibold text-[var(--text-secondary)]">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={categoryDesc}
                                    onChange={(e) => setCategoryDesc(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 font-semibold rounded-full border border-[var(--border-subtle)] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-semibold rounded-full bg-[var(--accent-primary)] text-white cursor-pointer"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tag Modal */}
            {isTagModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                            <h3 className="font-serif text-base font-bold text-[var(--text-primary)]">
                                {editingTag ? 'Edit Tag' : 'New Editorial Tag'}
                            </h3>
                            <button
                                onClick={() => setIsTagModalOpen(false)}
                                className="p-1 rounded-full text-[var(--text-muted)] cursor-pointer"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveTag} className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-[var(--text-secondary)]">
                                    Tag Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-semibold text-[var(--text-secondary)]">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={tagDesc}
                                    onChange={(e) => setTagDesc(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTagModalOpen(false)}
                                    className="px-4 py-2 font-semibold rounded-full border border-[var(--border-subtle)] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-semibold rounded-full bg-[var(--accent-primary)] text-white cursor-pointer"
                                >
                                    Save Tag
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminConsolePage;
