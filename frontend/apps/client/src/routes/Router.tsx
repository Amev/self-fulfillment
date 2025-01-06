import { useTailwindStyleTagOrder } from 'common-hooks';
import { AUTH_STATUSES, AuthStatus, Roles } from 'common-types';
import { StrictMode } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import ContentSpiner from 'components/layout/ContentSpiner';
import MainLayout from 'components/layout/MainLayout';
import Home from 'routes/home/Home';
import NotFound from 'routes/notfound/NotFound';
import Organization from 'routes/organization/Organization';
import OrganizationSettings from 'routes/organization/OrganizationSettings';
import Profile from 'routes/profile/Profile';
import { getAuthStatus } from 'stores/auth/authSlice';
import { useAppSelector } from 'stores/hooks';
import { useGetUserQuery } from 'stores/user/profileApi';

export default function Router() {
  const authStatus = useAppSelector(getAuthStatus);

  useTailwindStyleTagOrder();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StrictModeProvider />}>
          <Route element={<MainLayout />}>
            <Route
              element={<NotFound />}
              path='*'
            />
            <Route element={<ProtectedRoute authStatus={authStatus} />}>
              <Route
                element={<Home />}
                path='/'
              />
              <Route
                element={<Profile />}
                path='/profile'
              />
              <Route
                element={<Organization />}
                path='/organizations/:organizationID'
              />
              <Route
                element={<OrganizationSettings />}
                path='/organizations/:organizationID/settings'
              />
            </Route>
            <Route element={<PublicRoute authStatus={authStatus} />}>
              <Route element={<NotFound />} />
            </Route>
          </Route>
        </Route>
        <Route element={<AnonymousRoute authStatus={authStatus} />} />
      </Routes>
    </BrowserRouter>
  );
}

export function generateAuthURL(host: string) {
  const currentURL = new URL(window.location.href);

  if (currentURL.searchParams.has('state')) {
    currentURL.searchParams.delete('state');
  }

  return `${host}?state=${encodeURI(
    JSON.stringify({ redirectURI: currentURL.toString() }),
  )}`;
}

interface PublicRouteProps {
  authStatus: AuthStatus;
}
interface ProtectedRouteProps extends PublicRouteProps {
  roles?: Roles[];
  redirect?: string;
}

interface AnonymousRouteProps extends PublicRouteProps {
  redirect?: string;
}

function ProtectedRoute({
  authStatus,
  roles = [],
  redirect = import.meta.env.VITE_SIGN_IN_URL!,
}: ProtectedRouteProps) {
  const { data: user } = useGetUserQuery();

  if (authStatus === AUTH_STATUSES.NOT_CHECKED) {
    return <ContentSpiner />;
  }

  if (
    authStatus === AUTH_STATUSES.LOGGED_OUT ||
    authStatus === AUTH_STATUSES.NOT_LOGGED ||
    !user
  ) {
    window.location.replace(generateAuthURL(redirect));

    return null;
  }

  if (roles.some((role) => !user.groups.includes(role))) {
    return <NotFound />;
  }

  return <Outlet context={{ user }} />;
}

function PublicRoute({ authStatus }: PublicRouteProps) {
  if (authStatus === AUTH_STATUSES.NOT_CHECKED) {
    return <ContentSpiner />;
  }

  return <Outlet />;
}

function AnonymousRoute({ authStatus, redirect = '/' }: AnonymousRouteProps) {
  if (authStatus === AUTH_STATUSES.NOT_CHECKED) {
    return <ContentSpiner />;
  }

  if (authStatus === AUTH_STATUSES.LOGGED) {
    return <Navigate to={redirect} />;
  }

  return <Outlet />;
}

function StrictModeProvider() {
  return (
    <StrictMode>
      <Outlet />
    </StrictMode>
  );
}
