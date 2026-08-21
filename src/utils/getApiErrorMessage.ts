type ErrorField =
    'email' | 'password' | 'otp' | 'newPassword' | 'confirmPassword' | 'oldPassword' | 'message';

type ApiErrorShape = {
    data?: {
        error?: Partial<Record<ErrorField, unknown>> | string;
        message?: unknown;
    };
    error?: string | { message?: unknown };
    message?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const getString = (value: unknown) => (typeof value === 'string' ? value : null);

export const getApiErrorMessage = (error: unknown, fallback = 'Check your internet connection') => {
    if (!isRecord(error)) return fallback;

    const apiError = error as ApiErrorShape;
    const fieldError = apiError.data?.error;
    const fields: ErrorField[] = [
        'email',
        'password',
        'otp',
        'newPassword',
        'confirmPassword',
        'oldPassword',
        'message',
    ];

    if (typeof fieldError === 'string') return fieldError;

    if (isRecord(fieldError)) {
        for (const field of fields) {
            const message = getString(fieldError[field]);
            if (message) return message;
        }
    }

    const dataMessage = getString(apiError.data?.message);
    if (dataMessage) return dataMessage;

    if (typeof apiError.error === 'string') return apiError.error;

    const nestedMessage = getString(apiError.error?.message);
    if (nestedMessage) return nestedMessage;

    const message = getString(apiError.message);
    return message ?? fallback;
};
