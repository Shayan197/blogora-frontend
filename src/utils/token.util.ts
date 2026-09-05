import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '@/constants/config';
import type { AuthTokens } from '@/types/auth';

// ========================================
//           Types
// ========================================
type TokenResponse = {
    data?: AuthTokens;
    error?: string;
};

// ========================================
//           Functions
// ========================================
// This function is used in the token manager to refresh the token via HttpOnly cookies.
const getFreshToken = async (_refreshToken?: string): Promise<TokenResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/token-refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            return { error: 'TOKEN_EXPIRED' };
        }
        return {
            data: {
                accessToken: 'cookie-session',
                refreshToken: 'cookie-session',
            },
        };
    } catch {
        return { error: 'FETCH_ERROR' };
    }
};

export default getFreshToken;

// ================================================================
type JwtPayload = {
    exp?: number;
};

// This function gives the time remaining in seconds before the access token expires.
export const verifyAccessTokenExpiry = (accessToken: string): number => {
    try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        const expiredAt = decoded.exp;
        if (!expiredAt) return 0;

        const remainingSeconds = expiredAt - currentTime;

        return Math.max(0, Math.floor(remainingSeconds));
    } catch {
        return 0;
    }
};
