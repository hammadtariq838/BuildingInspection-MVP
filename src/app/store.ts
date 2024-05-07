import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import authReducer from '@/features/auth/authSlice';
import { userApiSlice } from '@/services/user/userApiSlice';
import { projectApiSlice } from '@/services/project/projectApiSlice';
import { assetApiSlice } from '@/services/asset/assetApiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [projectApiSlice.reducerPath]: projectApiSlice.reducer,
  [assetApiSlice.reducerPath]: assetApiSlice.reducer,
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    })
      .concat(userApiSlice.middleware)
      .concat(projectApiSlice.middleware)
      .concat(assetApiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
