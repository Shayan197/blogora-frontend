'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ThemeToggle from '@/app/ThemeToggler';
import Button from '@/components/auth/Button';
import H1 from '@/components/auth/H1';
import Icon from '@/components/auth/Icon';
import Input from '@/components/auth/Input';
import Redirect from '@/components/common/Redirect';
import RootError from '@/components/common/RootError';
import { setOTPFlow } from '@/redux/features/otpSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useForgetPasswordMutation } from '@/redux/services/api/auth/auth';
import { authFlowStorage } from '@/utils/authStorage.util';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const forgetPasswordSchema = schema.pick({
    email: true,
});

type ForgetPasswordForm = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ForgetPasswordForm>({ resolver: zodResolver(forgetPasswordSchema) });

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [forgetPasswordReq, { isLoading }] = useForgetPasswordMutation();

    const submit: SubmitHandler<ForgetPasswordForm> = async (data) => {
        try {
            const response = await forgetPasswordReq(data).unwrap();
            if (response) {
                toast.success(response.message ?? 'Verification code sent to your email');
                authFlowStorage.setOtpContext(data.email, 'forget');
                authFlowStorage.clearPasswordResetEmail();
                dispatch(setOTPFlow('forget'));
                router.push('/otp-verify');
            }
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
                    <H1 name="Forgot Password" />
                    <p className="text-xs text-center text-[var(--text-secondary)] mb-6">
                        Enter your registered email address to receive a 6-digit verification code.
                    </p>
                    <Icon />

                    <Input
                        label="Registered Email Address"
                        name="email"
                        type="email"
                        placeholder="you@domain.com"
                        register={register}
                        error={errors.email?.message}
                        autoComplete="email"
                    />

                    <Button
                        isSubmitting={isSubmitting || isLoading}
                        loading="Sending OTP code..."
                        text="Send Verification Code"
                    />

                    <RootError error={errors.root} />

                    <div className="pt-4 border-t border-[var(--border-subtle)] mt-6">
                        <Redirect
                            text="Remember your password?"
                            linkText="Sign In"
                            linkTo="/login"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
