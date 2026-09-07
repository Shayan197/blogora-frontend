import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type {
    AuthTokens,
    EmailRequest,
    LoginRequest,
    OtpVerifyRequest,
    ResetPasswordRequest,
    SignupRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
    UserProfile,
} from '@/types/auth';

type MessageResponse = ResponseType<null>;
type AuthResponse = ResponseType<AuthTokens>;
type UserProfileResponse = ResponseType<{ user: UserProfile }>;

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<MessageResponse, SignupRequest>({
            query: (credentials) => ({
                url: '/auth/signup',
                method: 'POST',
                body: credentials,
            }),
        }),

        otpVerify: builder.mutation<AuthResponse, OtpVerifyRequest>({
            query: ({ otp, email }) => ({
                url: '/auth/otp-verify',
                method: 'POST',
                body: { otp, email },
            }),
        }),

        otpResend: builder.mutation<MessageResponse, EmailRequest>({
            query: ({ email }) => ({
                url: '/auth/otp-resend',
                method: 'POST',
                body: { email },
            }),
        }),

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['UserProfile'],
        }),

        getMe: builder.query<UserProfileResponse, void>({
            query: () => '/auth/me',
            providesTags: ['UserProfile'],
        }),

        updateMe: builder.mutation<UserProfileResponse, UpdateProfileRequest>({
            query: (updateData) => ({
                url: '/auth/me',
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['UserProfile'],
        }),

        updatePassword: builder.mutation<MessageResponse, UpdatePasswordRequest>({
            query: (passwordData) => ({
                url: '/auth/password/update',
                method: 'POST',
                body: passwordData,
            }),
        }),

        forgetPassword: builder.mutation<MessageResponse, EmailRequest>({
            query: ({ email }) => ({
                url: '/auth/password/forget',
                method: 'POST',
                body: { email },
            }),
        }),

        forgetPasswordOtpVerify: builder.mutation<MessageResponse, OtpVerifyRequest>({
            query: ({ email, otp }) => ({
                url: '/auth/password/otp-verify',
                method: 'POST',
                body: { email, otp },
            }),
        }),

        forgetPasswordReset: builder.mutation<MessageResponse, ResetPasswordRequest>({
            query: (passwordData) => ({
                url: '/auth/password/reset',
                method: 'POST',
                body: passwordData,
            }),
        }),

        logout: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useSignupMutation,
    useOtpVerifyMutation,
    useOtpResendMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery,
    useUpdateMeMutation,
    useUpdatePasswordMutation,
    useForgetPasswordMutation,
    useForgetPasswordOtpVerifyMutation,
    useForgetPasswordResetMutation,
    useLazyGetMeQuery,
    usePrefetch,
} = authApi;
