import { useTailwindStyleTagOrder } from 'common-hooks';
import { AUTH_STATUSES } from 'common-types';
import { Spin } from 'design-system';
import { StrictMode, useCallback, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useSearchParams,
} from 'react-router-dom';
import AppLayout from 'components/layout/AppLayout';
import ContentSpiner from 'components/layout/ContentSpiner';
import SignUpConfirm from 'routes/confirm/SignUpConfirm';
import ForgotPassword from 'routes/forgotpassword/ForgotPassword';
import Mfa from 'routes/signin/Mfa';
import SignIn from 'routes/signin/SignIn';
import SignUp from 'routes/signup/SignUp';
import { getAuthStatus } from 'stores/auth/authSlice';
import {
  useGetUserQuery,
  useSignInProviderMutation,
} from 'stores/auth/userApi';
import { useAppSelector } from 'stores/hooks';

export default function Router() {
  useTailwindStyleTagOrder();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StrictModeProvider />}>
          <Route element={<AppLayout />}>
            <Route element={<SignInProvider />}>
              <Route
                element={<SignIn />}
                path='*'
              />
              <Route
                element={<SignUp />}
                path='/sign-up'
              />
              <Route
                element={<SignUpConfirm />}
                path='/confirm'
              />
              <Route
                element={<Mfa />}
                path='/mfa'
              />
              <Route
                element={<ForgotPassword />}
                path='/forgot-password'
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function StrictModeProvider() {
  return (
    <StrictMode>
      <Outlet />
    </StrictMode>
  );
}

export interface RedirectURIContext {
  generateURI: (to: string) => string;
  redirectURI: string;
}

function SignInProvider() {
  const authStatus = useAppSelector(getAuthStatus);
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  const { redirectURI, provider } = useMemo(() => {
    try {
      const decodedState = JSON.parse(decodeURI(state || ''));

      return {
        redirectURI:
          decodedState.redirectURI ||
          import.meta.env.VITE_AUTH_DEFAULT_REDIRECT_URI,
        provider: decodedState.provider || 'cognito',
      };
    } catch {
      return {
        redirectURI: import.meta.env.VITE_AUTH_DEFAULT_REDIRECT_URI,
        provider: 'cognito',
      };
    }
  }, [state]);
  const generateURI = useCallback(
    (to: string) => {
      const encodedState = encodeURI(JSON.stringify({ redirectURI }));
      return `${to}?state=${encodedState}`;
    },
    [redirectURI],
  );
  const [signInProvider, { isLoading: signInProviderIsLoading }] =
    useSignInProviderMutation();

  useGetUserQuery();
  useEffect(() => {
    if (code) {
      signInProvider({
        clientId: getClientID(provider),
        code,
        provider,
      });
    }
  }, [code, provider, signInProvider]);

  if (authStatus === AUTH_STATUSES.NOT_CHECKED) {
    return <ContentSpiner />;
  }

  if (authStatus === AUTH_STATUSES.LOGGED) {
    window.location.replace(redirectURI);

    return <ContentSpiner />;
  }

  if (signInProviderIsLoading) {
    return <Spin />;
  }

  return <Outlet context={{ generateURI, redirectURI }} />;
}

function getClientID(provider: string) {
  switch (provider) {
    case 'google':
      return import.meta.env.VITE_GOOGLE_CLIENT_ID;
    case 'cognito':
    default:
      return import.meta.env.VITE_COGNITO_CLIENT_ID;
  }
}
