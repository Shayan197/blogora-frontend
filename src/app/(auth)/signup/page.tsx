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
import Gender from '@/components/auth/Gender';
import H1 from '@/components/auth/H1';
import Icon from '@/components/auth/Icon';
import Input from '@/components/auth/Input';
import Redirect from '@/components/common/Redirect';
import RootError from '@/components/common/RootError';
import { setOTPFlow } from '@/redux/features/otpSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useSignupMutation } from '@/redux/services/api/auth/auth';
import { authFlowStorage } from '@/utils/authStorage.util';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const signupSchema = schema
    .pick({
        firstName: true,
        lastName: true,
        gender: true,
        email: true,
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Confirm password does not match with new password',
        path: ['confirmPassword'],
    });

type SignupForm = z.infer<typeof signupSchema>;

const Signup = (): React.JSX.Element => {
    const [signup, { isLoading }] = useSignupMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

    const submit: SubmitHandler<SignupForm> = async (data) => {
        try {
            const response = await signup(data).unwrap();
            if (response) {
                toast.success(response.message ?? 'Verification code sent to your email');
                authFlowStorage.setOtpContext(data.email, 'signup');
                dispatch(setOTPFlow('signup'));
                router.push('/otp-verify');
            }
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error));
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

            <div className="w-full max-w-lg space-y-6">
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
                        Join our community of technical writers and readers.
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col"
                >
                    <H1 name="Create an Account" />
                    <Icon />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Alex"
                            register={register}
                            error={errors.firstName?.message}
                            autoComplete="given-name"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Mercer"
                            register={register}
                            error={errors.lastName?.message}
                            autoComplete="family-name"
                        />
                    </div>

                    <Gender
                        label="Gender"
                        name="gender"
                        register={register}
                        error={errors.gender?.message}
                    />

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="alex@domain.com"
                        register={register}
                        error={errors.email?.message}
                        autoComplete="email"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            register={register}
                            error={errors.password?.message}
                            autoComplete="new-password"
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            register={register}
                            error={errors.confirmPassword?.message}
                            autoComplete="new-password"
                        />
                    </div>

                    <Button
                        isSubmitting={isSubmitting || isLoading}
                        loading="Creating account..."
                        text="Register with Chronicle"
                    />

                    <RootError error={errors.root} />

                    <div className="pt-4 border-t border-[var(--border-subtle)] mt-6">
                        <Redirect
                            text="Already have an account?"
                            linkText="Sign In"
                            linkTo="/login"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
