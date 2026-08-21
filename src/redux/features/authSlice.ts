import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthTokens } from '@/types/auth';

// ==============================================================================
//                                      TYPES
// ==============================================================================
type AuthState = {
    isAuthenticated: boolean; // Indicates if the user is authenticated
    isAuthInitialized: boolean; // Indicates if initial token bootstrap has completed
    isSessionExpired: boolean; // Indicates if the session has expired while using the app.
    accessToken: string | null;
    refreshToken: string | null;
};

// ==============================================================================
//                                      Slice
// ==============================================================================
// INITIAL STATE
const initialState: AuthState = {
    isAuthenticated: false,
    isAuthInitialized: false,
    isSessionExpired: false,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthTokens>) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isAuthInitialized = true;
            state.isSessionExpired = false;
        },
        setAccRefTokens(state, action: PayloadAction<AuthTokens>) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isAuthInitialized = true;
            state.isSessionExpired = false;
        },
        expireSession(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isAuthInitialized = true;
            state.isSessionExpired = true;
        },
        completeAuthBootstrap(state) {
            state.isAuthInitialized = true;
        },
    },
});

export const { login, setAccRefTokens, logout, expireSession, completeAuthBootstrap } =
    authSlice.actions;
export default authSlice.reducer;
