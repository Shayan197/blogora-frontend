import type { AuthTokens, OtpFlow } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const OTP_EMAIL_KEY = 'auth.otpEmail';
const OTP_FLOW_KEY = 'auth.otpFlow';
const PASSWORD_RESET_EMAIL_KEY = 'auth.passwordResetEmail';

const LEGACY_ACCESS_TOKEN_KEY = 'accessToken';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';
const LEGACY_OTP_EMAIL_KEY = 'otpEmail';

const getSessionStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
};

const getLocalStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
};

const readFromStorage = (storage: Storage | null, key: string) => {
    try {
        return storage?.getItem(key) ?? null;
    } catch {
        return null;
    }
};

const writeToStorage = (storage: Storage | null, key: string, value: string) => {
    try {
        storage?.setItem(key, value);
    } catch {
        // Storage may be unavailable in restricted browser contexts.
    }
};

const removeFromStorage = (storage: Storage | null, key: string) => {
    try {
        storage?.removeItem(key);
    } catch {
        // Storage may be unavailable in restricted browser contexts.
    }
};

const isOtpFlow = (value: string | null): value is OtpFlow =>
    value === 'signup' || value === 'forget';

export const authTokenStorage = {
    getAccessToken() {
        return (
            readFromStorage(getSessionStorage(), ACCESS_TOKEN_KEY) ??
            readFromStorage(getLocalStorage(), LEGACY_ACCESS_TOKEN_KEY)
        );
    },

    getRefreshToken() {
        return (
            readFromStorage(getLocalStorage(), REFRESH_TOKEN_KEY) ??
            readFromStorage(getLocalStorage(), LEGACY_REFRESH_TOKEN_KEY)
        );
    },

    setTokens(tokens: AuthTokens) {
        const sessionStorage = getSessionStorage();
        const localStorage = getLocalStorage();

        writeToStorage(sessionStorage, ACCESS_TOKEN_KEY, tokens.accessToken);
        writeToStorage(localStorage, REFRESH_TOKEN_KEY, tokens.refreshToken);

        removeFromStorage(localStorage, LEGACY_ACCESS_TOKEN_KEY);
        removeFromStorage(localStorage, LEGACY_REFRESH_TOKEN_KEY);
    },

    clearTokens() {
        const sessionStorage = getSessionStorage();
        const localStorage = getLocalStorage();

        removeFromStorage(sessionStorage, ACCESS_TOKEN_KEY);
        removeFromStorage(localStorage, REFRESH_TOKEN_KEY);
        removeFromStorage(localStorage, LEGACY_ACCESS_TOKEN_KEY);
        removeFromStorage(localStorage, LEGACY_REFRESH_TOKEN_KEY);
    },

    hasTokens() {
        return Boolean(
            readFromStorage(getSessionStorage(), ACCESS_TOKEN_KEY) ||
            readFromStorage(getLocalStorage(), REFRESH_TOKEN_KEY) ||
            readFromStorage(getLocalStorage(), LEGACY_REFRESH_TOKEN_KEY) ||
            readFromStorage(getLocalStorage(), LEGACY_ACCESS_TOKEN_KEY),
        );
    },
};

export const authFlowStorage = {
    setOtpContext(email: string, flow: OtpFlow) {
        const sessionStorage = getSessionStorage();
        const localStorage = getLocalStorage();

        writeToStorage(sessionStorage, OTP_EMAIL_KEY, email);
        writeToStorage(sessionStorage, OTP_FLOW_KEY, flow);
        removeFromStorage(localStorage, OTP_EMAIL_KEY);
        removeFromStorage(localStorage, OTP_FLOW_KEY);
        removeFromStorage(localStorage, LEGACY_OTP_EMAIL_KEY);
    },

    getOtpEmail() {
        return (
            readFromStorage(getSessionStorage(), OTP_EMAIL_KEY) ??
            readFromStorage(getLocalStorage(), OTP_EMAIL_KEY) ??
            readFromStorage(getLocalStorage(), LEGACY_OTP_EMAIL_KEY)
        );
    },

    getOtpFlow() {
        const flow =
            readFromStorage(getSessionStorage(), OTP_FLOW_KEY) ??
            readFromStorage(getLocalStorage(), OTP_FLOW_KEY);
        return isOtpFlow(flow) ? flow : null;
    },

    clearOtpContext() {
        const sessionStorage = getSessionStorage();
        const localStorage = getLocalStorage();

        removeFromStorage(sessionStorage, OTP_EMAIL_KEY);
        removeFromStorage(sessionStorage, OTP_FLOW_KEY);
        removeFromStorage(localStorage, OTP_EMAIL_KEY);
        removeFromStorage(localStorage, OTP_FLOW_KEY);
        removeFromStorage(localStorage, LEGACY_OTP_EMAIL_KEY);
    },

    setPasswordResetEmail(email: string) {
        const sessionStorage = getSessionStorage();
        const localStorage = getLocalStorage();

        writeToStorage(sessionStorage, PASSWORD_RESET_EMAIL_KEY, email);
        removeFromStorage(localStorage, PASSWORD_RESET_EMAIL_KEY);
    },

    getPasswordResetEmail() {
        return (
            readFromStorage(getSessionStorage(), PASSWORD_RESET_EMAIL_KEY) ??
            readFromStorage(getLocalStorage(), PASSWORD_RESET_EMAIL_KEY)
        );
    },

    clearPasswordResetEmail() {
        removeFromStorage(getSessionStorage(), PASSWORD_RESET_EMAIL_KEY);
        removeFromStorage(getLocalStorage(), PASSWORD_RESET_EMAIL_KEY);
    },
};
