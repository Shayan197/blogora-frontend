'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiGlobe,
    FiTwitter,
    FiGithub,
    FiLinkedin,
    FiMapPin,
    FiImage,
    FiLock,
    FiSave,
    FiArrowLeft,
} from 'react-icons/fi';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { useGetMeQuery, useUpdateMeMutation } from '@/redux/services/api/auth/auth';
import {
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
} from '@/redux/services/api/profiles/profilesApi';

export const EditProfilePage = (): React.JSX.Element => {
    const router = useRouter();

    const { data: userData } = useGetMeQuery();
    const { data: myProfileData } = useGetMyProfileQuery();
    const [updateUserReq, { isLoading: isUpdatingUser }] = useUpdateMeMutation();
    const [updateProfileReq, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();

    const user = userData?.data;
    const profile = myProfileData?.data?.user?.profile;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFirstName(user.firstName ?? '');
            setLastName(user.lastName ?? '');
            setEmail(user.email ?? '');
        }
        if (profile) {
            setHeadline(profile.headline ?? '');
            setBio(profile.bio ?? '');
            setLocation(profile.location ?? '');
            setWebsiteUrl(profile.websiteUrl ?? '');
            setTwitterUrl(profile.twitterUrl ?? '');
            setGithubUrl(profile.githubUrl ?? '');
            setLinkedinUrl(profile.linkedinUrl ?? '');
            setAvatar(profile.avatar ?? '');
        }
    }, [user, profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Update core user info
            await updateUserReq({
                firstName,
                lastName,
                email,
            }).unwrap();

            // Update extended profile info
            await updateProfileReq({
                headline,
                bio,
                location,
                websiteUrl,
                twitterUrl,
                githubUrl,
                linkedinUrl,
                avatar,
            }).unwrap();

            toast.success('Profile settings updated successfully!');
            router.push('/homepage');
        } catch {
            toast.error('Failed to update profile settings');
        }
    };

    const isSaving = isUpdatingUser || isUpdatingProfile;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="space-y-1">
                        <Link
                            href="/homepage"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <FiArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Feed</span>
                        </Link>
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                            Profile & Account Settings
                        </h1>
                    </div>

                    <Link
                        href="/updatepassword"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                    >
                        <FiLock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Update Password</span>
                    </Link>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Basic Account Info */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                            Account Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Author & Bio Customization */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                            Author Public Profile
                        </h2>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    Professional Headline
                                </label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Staff Infrastructure Engineer @ CloudOps"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                                    About / Bio
                                </label>
                                <textarea
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the community about your engineering passions, writing topics, and background..."
                                    className="w-full p-3.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <FiMapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Location</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="San Francisco, CA / London / Remote"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <FiImage className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Avatar Image URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Channels */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
                        <h2 className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                            Social Profiles & Website
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiGlobe className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Personal Website</span>
                                </label>
                                <input
                                    type="url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="https://yourdomain.com"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiTwitter className="w-3.5 h-3.5 text-sky-500" />
                                    <span>Twitter / X Profile</span>
                                </label>
                                <input
                                    type="url"
                                    value={twitterUrl}
                                    onChange={(e) => setTwitterUrl(e.target.value)}
                                    placeholder="https://twitter.com/handle"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiGithub className="w-3.5 h-3.5" />
                                    <span>GitHub Profile</span>
                                </label>
                                <input
                                    type="url"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/username"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <FiLinkedin className="w-3.5 h-3.5 text-blue-600" />
                                    <span>LinkedIn Profile</span>
                                </label>
                                <input
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/homepage')}
                            className="px-5 py-2.5 rounded-full text-xs font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                        >
                            <FiSave className="w-4 h-4" />
                            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default EditProfilePage;
