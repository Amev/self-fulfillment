import { UserOutlined } from '@ant-design/icons';
import { User } from 'common-types';
import { Button, Title } from 'design-system';
import { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import BasicInformations from 'components/profile/BasicInformations';
import CredentialsInformations from 'components/profile/CredentialsInformations';
import { signoutAsync } from 'stores/auth/authSlice';
import { useAppDispatch } from 'stores/hooks';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useOutletContext<{ user: User }>();
  const dispatch = useAppDispatch();
  const onSignOut = useCallback(() => dispatch(signoutAsync()), [dispatch]);

  return (
    <Fragment>
      <Title level={2}>
        <UserOutlined className='!text-blue-500 mr-2' />
        {t('profile.title')}
      </Title>
      <div className='grid grid-cols-2 gap-4 py-8'>
        <div className='col-span-2'>
          <BasicInformations user={user} />
        </div>
        <div className='col-span-2'>
          <CredentialsInformations user={user} />
        </div>
      </div>
      <Button
        onClick={onSignOut}
        type='link'
      >
        {t('profile.log-out')}
      </Button>
    </Fragment>
  );
}
