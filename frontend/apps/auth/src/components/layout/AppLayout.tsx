import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <main className='flex flex-col min-h-screen bg-gradient'>
      <div
        className='flex flex-col justify-center min-h-screen bg-scroll bg-no-repeat bg-contain'
        style={{ backgroundImage: 'url(background.svg)' }}
      >
        <Outlet />
      </div>
    </main>
  );
}
