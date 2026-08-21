'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ThemeToggle from '@/app/ThemeToggler';
import Button from '@/components/auth/Button';
import H1 from '@/components/auth/H1';
import Icon from '@/components/auth/Icon';
import OtpInput from '@/components/auth/Otp';
import RootError from '@/components/common/RootError';
import { RootState } from '@/redux';
import { login } from '@/redux/features/authSlice';
import { clearOTPFlow } from '@/redux/features/otpSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
    useForgetPasswordMutation,
    useForgetPasswordOtpVerifyMutation,
    useOtpResendMutation,
    useOtpVerifyMutation,
} from '@/redux/services/api/auth/auth';
import type { OtpFlow } from '@/types/auth';
import { maskEmail, formatTime } from '@/utils/auth.util';
import { authFlowStorage, authTokenStorage } from '@/utils/authStorage.util';
import { schema } from '@/utils/authValidations.util';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const OTP_LENGTH = 6;
const MAX_RESEND_ATTEMPTS = 3;

const otpVerifySchema = schema.pick({
    otp: true,
});

type OtpVerifyForm = z.infer<typeof otpVerifySchema>;

type OtpContext = {
    email: string;
    flow: OtpFlow;
};

const getResendCooldown = (attempt: number) => {
    if (attempt === 1) return 10;
    if (attempt === 2) return 60 * 60;
    return 24 * 60 * 60;
};

const OtpVerify = (): React.JSX.Element => {
    const [otp, setOtp] = useState(Array<string>(OTP_LENGTH).fill(''));
    const [otpContext, setOtpContext] = useState<OtpContext | null>(null);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();
    const fallbackFlow = useAppSelector((state: RootState) => state.otp.flow);
    const fallbackFlowRef = useRef(fallbackFlow);
    const dispatch = useAppDispatch();
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<OtpVerifyForm>({
        resolver: zodResolver(otpVerifySchema),
    });

    const [verifySignupOtp, { isLoading: isVerifySignupLoading }] = useOtpVerifyMutation();
    const [resendSignupOtp, { isLoading: isSignupResendLoading }] = useOtpResendMutation();
    const [requestPasswordOtp, { isLoading: isPasswordResendLoading }] =
        useForgetPasswordMutation();
    const [verifyPasswordOtp, { isLoading: isVerifyPasswordLoading }] =
        useForgetPasswordOtpVerifyMutation();

    const isResending = isSignupResendLoading || isPasswordResendLoading;
    const isVerifying = isVerifySignupLoading || isVerifyPasswordLoading;
    const canResend = timeLeft === 0 && resendAttempts < MAX_RESEND_ATTEMPTS;
    const maskedEmail = useMemo(() => maskEmail(otpContext?.email ?? ''), [otpContext?.email]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const email = authFlowStorage.getOtpEmail();
            const activeFlow = authFlowStorage.getOtpFlow() ?? fallbackFlowRef.current;

            if (!email || !activeFlow) {
                router.replace('/login');
                return;
            }

            setOtpContext({ email, flow: activeFlow });
        }, 0);

        return () => window.clearTimeout(timer);
    }, [router]);

    useEffect(() => {
        setValue('otp', otp.join(''), { shouldValidate: otp.every(Boolean) });
    }, [otp, setValue]);

    useEffect(() => {
        if (timeLeft === 0) return undefined;

        const interval = window.setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => window.clearInterval(interval);
    }, [timeLeft]);

    const handleChange = (value: string, idx: number) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const nextOtp = [...otp];
        nextOtp[idx] = digit;
        setOtp(nextOtp);

        if (digit && idx < OTP_LENGTH - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (!otpContext || !canResend) return;

        try {
            const response =
                otpContext.flow === 'forget'
                    ? await requestPasswordOtp({ email: otpContext.email }).unwrap()
                    : await resendSignupOtp({ email: otpContext.email }).unwrap();

            toast.success(response.message ?? 'Verification code sent');
            const nextAttempt = resendAttempts + 1;
            setResendAttempts(nextAttempt);
            setTimeLeft(getResendCooldown(nextAttempt));
        } catch (error: unknown) {
            setError('root', {
                message: getApiErrorMessage(error),
            });
        }
    };

    const submit: SubmitHandler<OtpVerifyForm> = async (data) => {
        if (!otpContext) {
            setError('root', { message: 'Email not found. Please restart the process.' });
            return;
        }

        const payload = {
            otp: Number(data.otp),
            email: otpContext.email,
        };

        if (otpContext.flow === 'signup') {
            try {
                const response = await verifySignupOtp(payload).unwrap();
                const tokens = response.data;

                if (!tokens?.accessToken || !tokens.refreshToken) {
                    toast.success(
                        response.message ?? 'Account verified! Please login with your credentials.',
                    );
                    authFlowStorage.clearOtpContext();
                    dispatch(clearOTPFlow());
                    router.replace('/login');
                    return;
                }

                toast.success(response.message ?? 'Account verified successfully');
                authFlowStorage.clearOtpContext();
                authTokenStorage.setTokens(tokens);
                dispatch(clearOTPFlow());
                dispatch(login(tokens));
                router.replace('/homepage');
            } catch (error: unknown) {
                setError('root', {
                    message: getApiErrorMessage(error),
                });
            }
            return;
        }

        try {
            const response = await verifyPasswordOtp(payload).unwrap();

            toast.success(response.message ?? 'OTP verified successfully');
            authFlowStorage.setPasswordResetEmail(otpContext.email);
            authFlowStorage.clearOtpContext();
            dispatch(clearOTPFlow());
            router.push('/reset-password');
        } catch (error: unknown) {
            setError('root', {
                message: getApiErrorMessage(error),
            });
        }
    };

    if (!otpContext) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <p className="text-xs text-[var(--text-muted)]">Loading verification session...</p>
            </div>
        );
    }

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
                    <H1 name="Verify Security Code" />
                    <p className="text-xs text-center text-[var(--text-secondary)]">
                        Enter the 6-digit verification code sent to
                    </p>
                    <p className="text-xs text-center font-bold text-[var(--text-primary)] mb-6">
                        {maskedEmail}
                    </p>
                    <Icon />

                    <div className="flex gap-2 sm:gap-3 justify-center my-4">
                        {otp.map((digit, idx) => (
                            <OtpInput
                                key={idx}
                                value={digit}
                                idx={idx}
                                handleChange={handleChange}
                                inputsRef={inputsRef}
                                error={errors.otp?.message}
                            />
                        ))}
                    </div>

                    <input type="hidden" {...register('otp')} />

                    <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
                        Didn&apos;t receive the code?{' '}
                        <button
                            type="button"
                            disabled={!canResend || isResending}
                            onClick={handleResend}
                            className={`font-semibold underline ${
                                !canResend || isResending
                                    ? 'text-[var(--text-muted)] cursor-not-allowed'
                                    : 'text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] cursor-pointer'
                            }`}
                        >
                            {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
                        </button>
                    </p>

                    <div className="h-6">
                        {errors.otp && (
                            <span className="text-rose-500 text-xs text-center block">
                                {errors.otp.message}
                            </span>
                        )}
                    </div>

                    <Button
                        isSubmitting={isSubmitting || isVerifying || isResending}
                        loading={isResending ? 'Sending...' : 'Verifying...'}
                        text="Verify & Continue"
                    />

                    <RootError error={errors.root} />
                </form>
            </div>
        </div>
    );
};

export default OtpVerify;
