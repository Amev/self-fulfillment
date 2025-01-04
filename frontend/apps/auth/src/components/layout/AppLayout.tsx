import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col h-[600px]'>
      <header className='flex flex-row gap-4 w-full'>
        <Link to='/'>{t('layout.header.links.home')}</Link>
        <Link to='/permissions'>{t('layout.header.links.permissions')}</Link>
      </header>
      <main className='flex flex-col flex-grow'>
        <Outlet />
      </main>
    </div>
  );
}
