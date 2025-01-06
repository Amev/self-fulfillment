import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import authReducer from 'stores/auth/authSlice';
import credentialsApi from 'stores/auth/credentialsApi';
import userApi from 'stores/auth/userApi';

const rootReducer = combineReducers({
  auth: authReducer,
  [credentialsApi.reducerPath]: credentialsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userApi.middleware,
      credentialsApi.middleware,
    ]),
});

export type AppDispatch = typeof setupStore.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
