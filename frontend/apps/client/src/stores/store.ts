import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { authSlice } from 'stores/auth/authSlice';
import authMiddleware from './authMiddleware';
import organizationsApi from './organizations/organizationsApi';
import profileApi from './user/profileApi';
import securityProfileApi from './user/securityProfileApi';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [securityProfileApi.reducerPath]: securityProfileApi.reducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authMiddleware,
      profileApi.middleware,
      securityProfileApi.middleware,
      organizationsApi.middleware,
    ]),
});

export type AppDispatch = typeof setupStore.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
