'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiEdit3,
    FiBell,
    FiUser,
    FiLogOut,
    FiBookOpen,
    FiMenu,
    FiX,
    FiCompass,
    FiShield,
    FiLayers,
} from 'react-icons/fi';
import ThemeToggle from '@/app/ThemeToggler';
import { logout } from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { authApi, useGetMeQuery, useLogoutMutation } from '@/redux/services/api/auth/auth';
import { useGetNotificationsQuery } from '@/redux/services/api/notifications/notificationsApi';
import { authFlowStorage, authTokenStorage } from '@/utils/authStorage.util';

interface NavbarProps {
    onOpenSearch?: () => void;
}

export const Navbar = ({ onOpenSearch }: NavbarProps): React.JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [logoutRequest] = useLogoutMutation();

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const { data: userData } = useGetMeQuery(undefined, { skip: !isAuthenticated });
    const { data: notifsData } = useGetNotificationsQuery({ limit: 5 }, { skip: !isAuthenticated });

    const user = userData?.data?.user;
    const unreadCount = notifsData?.data?.unreadCount ?? 0;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutRequest().unwrap();
        } catch {
            // Ignore API logout error if session was already invalid or network issue
        } finally {
            dispatch(logout());
            dispatch(authApi.util.resetApiState());
            authTokenStorage.clearTokens();
            authFlowStorage.clearOtpContext();
            authFlowStorage.clearPasswordResetEmail();
            setIsMenuOpen(false);
            router.push('/login');
        }
    };

    const navLinks = [
        { label: 'Explore', href: '/explore', icon: FiCompass },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    const isAuthorOrAdmin = true; // User can publish if authenticated

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-surface/85 backdrop-blur-xl border-b border-border-subtle shadow-sm'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                                <span className="font-serif font-bold italic text-2xl tracking-tighter">
                                    B
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl font-bold tracking-tight text-text-primary group-hover:text-blue-600 transition-colors">
                                    Blogora
                                </span>
                                <span className="text-[10px] uppercase font-semibold tracking-widest text-text-muted -mt-1">
                                    Editorial
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors hover:text-accent-primary ${
                                            isActive
                                                ? 'text-accent-primary font-semibold'
                                                : 'text-text-secondary'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Search Trigger — icon only on mobile, full pill on sm+ */}
                        <button
                            type="button"
                            onClick={onOpenSearch ?? (() => router.push('/explore'))}
                            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-surface-subtle hover:bg-border-subtle text-text-muted hover:text-text-primary transition-all text-xs font-medium border border-border-subtle"
                            aria-label="Search stories"
                        >
                            <FiSearch className="w-4 h-4 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="hidden sm:inline">Search stories...</span>
                            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-surface rounded border border-border-subtle text-text-muted">
                                ⌘K
                            </kbd>
                        </button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <>
                                {/* Write Story Button — hidden on mobile (in drawer) */}
                                {isAuthorOrAdmin && (
                                    <Link
                                        href="/publish"
                                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 hover:-translate-y-0.5"
                                    >
                                        <FiEdit3 className="w-4 h-4" />
                                        <span>Write</span>
                                    </Link>
                                )}

                                {/* Notifications Bell */}
                                <Link
                                    href="/notifications"
                                    className="relative p-2 sm:p-2.5 rounded-full bg-surface-subtle hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors border border-border-subtle flex-shrink-0"
                                    aria-label="Notifications"
                                >
                                    <FiBell className="w-4 h-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Menu Dropdown */}
                                <div className="relative hidden md:block">
                                    <button
                                        type="button"
                                        onClick={() => setIsMenuOpen((prev) => !prev)}
                                        className="flex items-center gap-2 p-1 rounded-full border-2 border-border-subtle hover:border-blue-500 transition-all cursor-pointer"
                                        aria-label="User Profile Menu"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                                        </div>
                                    </button>

                                    {isMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-surface border border-border-subtle shadow-xl z-50 py-2 divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-150">
                                                <div className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-text-primary truncate">
                                                        {user?.firstName} {user?.lastName}
                                                    </p>
                                                    <p className="text-xs text-text-muted truncate">
                                                        {user?.email}
                                                    </p>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        href="/homepage"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                                    >
                                                        <FiLayers className="w-4 h-4 text-blue-500" />
                                                        <span>My Feed</span>
                                                    </Link>
                                                    <Link
                                                        href="/dashboard/stories"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                                    >
                                                        <FiBookOpen className="w-4 h-4 text-indigo-500" />
                                                        <span>Stories Dashboard</span>
                                                    </Link>
                                                    <Link
                                                        href="/editprofile"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                                    >
                                                        <FiUser className="w-4 h-4 text-sky-500" />
                                                        <span>Settings & Profile</span>
                                                    </Link>
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                                    >
                                                        <FiShield className="w-4 h-4 text-emerald-500" />
                                                        <span>Admin Console</span>
                                                    </Link>
                                                </div>

                                                <div className="py-1">
                                                    <button
                                                        type="button"
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                                                    >
                                                        <FiLogOut className="w-4 h-4" />
                                                        <span>Sign out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Auth buttons — hidden on mobile (shown in drawer) */
                            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/login"
                                    className="px-3.5 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-text-primary text-text-inverse hover:bg-accent-primary hover:text-white transition-all duration-200 shadow-sm whitespace-nowrap"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileNavOpen((prev) => !prev)}
                            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-subtle flex-shrink-0"
                            aria-label="Toggle navigation"
                        >
                            {isMobileNavOpen ? (
                                <FiX className="w-5 h-5" />
                            ) : (
                                <FiMenu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileNavOpen && (
                <div className="md:hidden bg-surface border-b border-border-subtle px-4 pt-3 pb-6 space-y-1">
                    {/* Nav Links */}
                    <nav className="flex flex-col space-y-0.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileNavOpen(false)}
                                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                href="/publish"
                                onClick={() => setIsMobileNavOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            >
                                <FiEdit3 className="w-4 h-4" />
                                <span>Write Story</span>
                            </Link>
                        )}
                    </nav>

                    <div className="border-t border-border-subtle pt-3 mt-3">
                        {isAuthenticated ? (
                            <div className="space-y-0.5">
                                {/* User info */}
                                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                        {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-text-primary truncate">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs text-text-muted truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/homepage"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                >
                                    <FiLayers className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <span>My Feed</span>
                                </Link>
                                <Link
                                    href="/dashboard/stories"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                >
                                    <FiBookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                    <span>Stories Dashboard</span>
                                </Link>
                                <Link
                                    href="/editprofile"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                >
                                    <FiUser className="w-4 h-4 text-sky-500 flex-shrink-0" />
                                    <span>Settings & Profile</span>
                                </Link>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                                >
                                    <FiShield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span>Admin Console</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileNavOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                                >
                                    <FiLogOut className="w-4 h-4 flex-shrink-0" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 px-1">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-text-primary border border-border-subtle hover:bg-surface-subtle transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm shadow-blue-500/25"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
