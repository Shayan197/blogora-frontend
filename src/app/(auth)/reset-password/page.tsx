'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ThemeToggle from '@/app/ThemeToggler';
import Button from '@/components/auth/Button';
import H1 from '@/components/auth/H1';
import Icon from '@/components/auth/Icon';
import Input from '@/components/auth/Input';
import RootError from '@/components/common/RootError';
import { useForgetPasswordResetMutation } from '@/redux/services/api/auth/auth';
import { authFlowStorage } from '@/utils/authStorage.util';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const resetSchema = schema
    .pick({
        email: true,
        newPassword: true,
        confirmPassword: true,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Confirm password does not match with new password',
        path: ['confirmPassword'],
    });

type ResetForm = z.infer<typeof resetSchema>;

const Reset = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: '',
        },
    });

    const router = useRouter();
    const [resetPassword, { isLoading }] = useForgetPasswordResetMutation();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const email = authFlowStorage.getPasswordResetEmail();

            if (!email) {
                router.replace('/forget-password');
                return;
            }

            setValue('email', email, { shouldValidate: true });
        }, 0);

        return () => window.clearTimeout(timer);
    }, [router, setValue]);

    const submit: SubmitHandler<ResetForm> = async (data) => {
        try {
            const response = await resetPassword(data).unwrap();
            toast.success(response.message ?? 'Password reset successfully');
            authFlowStorage.clearPasswordResetEmail();
            router.replace('/login');
        } catch (error: unknown) {
            setError('root', {
                message: getApiErrorMessage(error),
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 py-12 relative">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-serif font-black text-2xl shadow-md">
                            C
                        </div>
                        <span className="font-serif text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                            Chronicle
                        </span>
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col"
                >
                    <H1 name="Reset Password" />
                    <p className="text-xs text-center text-[var(--text-secondary)] mb-6">
                        Create a strong, secure new password for your account.
                    </p>
                    <Icon />

                    <Input
                        label="Account Email"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        register={register}
                        error={errors.email?.message}
                        readOnly
                        autoComplete="email"
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
                        loading="Resetting password..."
                        text="Reset & Sign In"
                    />

                    <RootError error={errors.root} />
                </form>
            </div>
        </div>
    );
};

export default Reset;
