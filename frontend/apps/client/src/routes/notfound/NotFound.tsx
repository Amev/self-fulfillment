import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col justify-center flex-1'>
      <Result
        className=''
        status='404'
        title={t('404')}
        subTitle={t('404.subtitle')}
      />
    </div>
  );
}
