import { useTailwindStyleTagOrder } from 'common-hooks';
import { StrictMode } from 'react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import AppLayout from 'components/layout/AppLayout';
import Home from 'routes/home/Home';
// import Permissions from 'routes/permissions/Permissions';

export default function Router() {
  useTailwindStyleTagOrder();

  return (
    <MemoryRouter>
      <Routes>
        <Route element={<StrictModeProvider />}>
          <Route element={<AppLayout />}>
            <Route
              element={<Home />}
              path='/'
            />
            {/* <Route
              element={<Permissions />}
              path='/permissions'
            /> */}
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
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
