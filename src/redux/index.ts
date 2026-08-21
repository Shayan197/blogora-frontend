import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import persistConfig from '@/redux/persistConfig';
import rootReducer from '@/redux/rootReducer';
import { apiSlice } from './services/apiSlice/apiSlice';

const persistedReducer = persistReducer(persistConfig, rootReducer);

// If you have other APIs, import their reducers and middlewares here
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
