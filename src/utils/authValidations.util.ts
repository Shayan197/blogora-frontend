import { z } from 'zod';

export const schema = z.object({
    firstName: z
        .string()
        .nonempty('Firstname is required')
        .min(2, 'At least 2 characters')
        .max(20, 'At most 20 characters')
        .regex(/^[A-Za-z]+([ '-][A-Za-z]+)*$/, 'Invalid firstname format'),

    lastName: z
        .string()
        .nonempty('Lastname is required')
        .min(2, 'At least 2 characters')
        .max(20, 'At most 20 characters')
        .regex(/^[A-Za-z]+([ '-][A-Za-z]+)*$/, 'Invalid lastname format'),

    email: z
        .string()
        .nonempty('Email is required')
        .trim()
        .toLowerCase()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),

    gender: z.enum(['male', 'female', 'other']).refine((val) => !!val, {
        message: 'Gender is required',
    }),

    otp: z
        .string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must be numeric'),

    password: z
        .string()
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .max(20, 'Password must not exceed 20 characters')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#]).+$/,
            'Password must include uppercase, lowercase, number, and special character',
        ),
    oldPassword: z.string().nonempty('Current password is required'),

    newPassword: z
        .string()
        .nonempty('New password must be required')
        .min(6, 'New Password must be at least 6 characters long')
        .max(20, 'Password must not exceed 20 characters')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#]).+$/,
            'Password must include uppercase, lowercase, number, and special character',
        ),

    confirmPassword: z.string().nonempty('Confirm password must be required'),
});
