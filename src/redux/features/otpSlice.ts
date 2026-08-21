import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OtpFlow } from '@/types/auth';

interface OtpState {
    flow: OtpFlow | null;
}

const initialState: OtpState = {
    flow: null,
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        setOTPFlow: (state, action: PayloadAction<OtpFlow>) => {
            state.flow = action.payload;
        },
        clearOTPFlow: (state) => {
            state.flow = null;
        },
    },
});

export const { setOTPFlow, clearOTPFlow } = otpSlice.actions;
export default otpSlice.reducer;
