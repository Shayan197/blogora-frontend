export type Gender = 'male' | 'female' | 'other';

export type OtpFlow = 'signup' | 'forget';

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type ApiResponse<T = unknown> = {
    data?: T;
    status: number | null;
    message?: string;
    success: boolean;
};

export type UserProfile = {
    id: string | number;
    uuid?: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    isActive: boolean;
    roleId?: number;
    avatar?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type SignupRequest = LoginRequest & {
    firstName: string;
    lastName: string;
    gender: Gender;
    confirmPassword: string;
};

export type OtpVerifyRequest = {
    email: string;
    otp: number;
};

export type EmailRequest = {
    email: string;
};

export type UpdateProfileRequest = {
    email: string;
    firstName: string;
    lastName: string;
};

export type UpdatePasswordRequest = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetPasswordRequest = {
    email: string;
    newPassword: string;
    confirmPassword: string;
};
