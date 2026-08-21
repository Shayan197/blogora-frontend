// store/persistConfig.ts
import storage from '@/utils/persistStorage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
};

export default persistConfig;
