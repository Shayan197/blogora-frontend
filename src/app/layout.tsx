import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Chronicle — Modern Editorial & Technical Publishing Platform',
        template: '%s | Chronicle Editorial',
    },
    description:
        'A refined space for deep thinking, technical excellence, and storytelling. Connecting discerning writers with engaged readers across software, architecture, and design.',
    keywords: [
        'Blog Management',
        'Medium',
        'Editorial',
        'TypeScript',
        'Next.js',
        'Architecture',
        'Software Engineering',
        'System Design',
    ],
    authors: [{ name: 'Chronicle Editorial Team' }],
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                padding: '14px 18px',
                                borderRadius: '14px',
                                background: 'var(--bg-surface-elevated, #1a2234)',
                                color: 'var(--text-primary, #ffffff)',
                                border: '1px solid var(--border-subtle, #334155)',
                                fontSize: '13px',
                                fontWeight: 500,
                                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#ffffff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#ffffff',
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
