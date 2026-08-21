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
import { login } from '@/redux/features/authSlice';
import { setOTPFlow } from '@/redux/features/otpSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/services/api/auth/auth';
import { authFlowStorage, authTokenStorage } from '@/utils/authStorage.util';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const loginSchema = schema.pick({
    email: true,
    password: true,
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = (): React.JSX.Element => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const [loginRequest, { isLoading }] = useLoginMutation();

    const submit: SubmitHandler<LoginForm> = async (data) => {
        try {
            const response = await loginRequest(data).unwrap();
            const tokens = response.data;

            // In cookie-based backend or token payload
            const accessToken = tokens?.accessToken || 'cookie-session';
            const refreshToken = tokens?.refreshToken || 'cookie-session';

            toast.success(response.message ?? 'Logged in successfully');
            authFlowStorage.clearOtpContext();
            authFlowStorage.clearPasswordResetEmail();
            authTokenStorage.setTokens({ accessToken, refreshToken });
            dispatch(login({ accessToken, refreshToken }));
            router.replace('/homepage');
        } catch (error: unknown) {
            const message = getApiErrorMessage(error);
            if (
                message.includes('User is not verified') ||
                message.includes('Account is not active')
            ) {
                authFlowStorage.setOtpContext(data.email, 'signup');
                dispatch(setOTPFlow('signup'));
                toast.error(message);
                router.push('/otp-verify');
                return;
            }
            setError('root', {
                message,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 py-12 relative">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-serif font-black text-2xl shadow-md">
                            C
                        </div>
                        <span className="font-serif text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                            Chronicle
                        </span>
                    </Link>
                    <p className="text-xs text-[var(--text-muted)]">
                        Welcome back. Sign in to your account.
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col"
                >
                    <H1 name="Welcome Back" />
                    <Icon />

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@domain.com"
                        register={register}
                        error={errors.email?.message}
                        autoComplete="email"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        register={register}
                        error={errors.password?.message}
                        autoComplete="current-password"
                    />

                    <div className="text-right -mt-2 mb-2">
                        <Link
                            href="/forget-password"
                            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        isSubmitting={isSubmitting || isLoading}
                        loading="Signing in..."
                        text="Sign In to Chronicle"
                    />

                    <RootError error={errors.root} />

                    <div className="pt-4 border-t border-[var(--border-subtle)] mt-6">
                        <Redirect
                            text="Don't have an account?"
                            linkText="Create one"
                            linkTo="/signup"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
