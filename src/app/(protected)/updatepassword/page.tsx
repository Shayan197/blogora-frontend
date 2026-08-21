'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { z } from 'zod';
import Button from '@/components/auth/Button';
import H1 from '@/components/auth/H1';
import Input from '@/components/auth/Input';
import RootError from '@/components/common/RootError';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { useUpdatePasswordMutation } from '@/redux/services/api/auth/auth';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const updatePasswordSchema = schema
    .pick({
        oldPassword: true,
        newPassword: true,
        confirmPassword: true,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Confirm password does not match with new password',
        path: ['confirmPassword'],
    });

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

const UpdatedPassword = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordForm>({ resolver: zodResolver(updatePasswordSchema) });

    const router = useRouter();
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const submit: SubmitHandler<UpdatePasswordForm> = async (data) => {
        try {
            const response = await updatePassword(data).unwrap();
            if (response) {
                toast.success(response.message ?? 'Password updated successfully');
                router.replace('/homepage');
            }
        } catch (error: unknown) {
            setError('root', {
                message: getApiErrorMessage(error),
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />

            <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12 space-y-6">
                <Link
                    href="/editprofile"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Profile</span>
                </Link>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col space-y-2"
                >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
                        <FiLock className="w-6 h-6" />
                    </div>
                    <H1 name="Update Password" />

                    <Input
                        label="Current Password"
                        name="oldPassword"
                        type="password"
                        placeholder="••••••••"
                        register={register}
                        error={errors.oldPassword?.message}
                        autoComplete="current-password"
                    />

                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        register={register}
                        error={errors.newPassword?.message}
                        autoComplete="new-password"
                    />

                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        register={register}
                        error={errors.confirmPassword?.message}
                        autoComplete="new-password"
                    />

                    <Button
                        isSubmitting={isSubmitting || isLoading}
                        loading="Updating password..."
                        text="Change Password"
                    />

                    <RootError error={errors.root} />
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default UpdatedPassword;
