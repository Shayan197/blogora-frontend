import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import counterReducer from '@/redux/features/counterSlice';
import otpReducer from '@/redux/features/otpSlice';
import { apiSlice } from './services/apiSlice/apiSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    counter: counterReducer,
    otp: otpReducer,
    api: apiSlice.reducer,
});

export default rootReducer;
