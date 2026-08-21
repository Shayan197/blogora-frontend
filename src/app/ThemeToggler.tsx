'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

export const ThemeToggle = (): React.JSX.Element => {
    const { setTheme, resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-10 h-10 rounded-full border border-transparent" />;
    }

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {isDark ? (
                    <FiSun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
                ) : (
                    <FiMoon className="w-4 h-4 text-slate-700 transition-transform duration-300 rotate-0 scale-100" />
                )}
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};

export default ThemeToggle;
