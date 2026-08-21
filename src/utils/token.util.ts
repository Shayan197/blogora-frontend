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
// This function is used in the token manager to get refresh the token.
const getFreshToken = async (refreshToken: string): Promise<TokenResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/token-refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            return { error: 'TOKEN_EXPIRED' };
        }
        const payload = (await response.json()) as { data?: Partial<AuthTokens> };
        const accessToken = payload.data?.accessToken;

        if (!accessToken) {
            return { error: 'INVALID_TOKEN_RESPONSE' };
        }

        return {
            data: {
                accessToken,
                refreshToken: payload.data?.refreshToken ?? refreshToken,
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
