import { Title, Avatar, Skeleton } from 'design-system';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useGetOrganizationQuery } from 'stores/organizations/organizationsApi';

export default function Organization() {
  const { t } = useTranslation();
  const { organizationID } = useParams();
  const { data: organization, isLoading } = useGetOrganizationQuery(
    organizationID || '',
  );

  if (!isLoading && !organization) {
    return <Navigate to='/' />;
  }

  if (isLoading) {
    return (
      <Fragment>
        <Title level={2}>
          <Skeleton.Avatar />
          <Skeleton.Input className='ml-2' />
        </Title>
        <div className='grid grid-cols-2 gap-4 py-8'>
          <Skeleton />
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className='flex flex-row justify-between items-center'>
        <Title level={2}>
          <Avatar
            alt={organization?.info.name.charAt(0)}
            src={organization?.info.logo}
            size='large'
          >
            {organization?.info.name.charAt(0) || ''}
          </Avatar>
          <span className='ml-2'>{organization?.info.name}</span>
        </Title>
      </div>
      <div className='grid grid-cols-2 gap-4 py-8'>
        <div className='col-span-2'>{t('organization.content')} </div>
      </div>
    </Fragment>
  );
}
