import { Title } from 'design-system';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center grow gap-y-8'>
      <Title>{t('home.placeholder')}</Title>
      <Link to='/profile'>Profile</Link>
    </div>
  );
}
