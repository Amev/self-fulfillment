import { PERMISSIONS, User } from 'common-types/model';
import { Title, Avatar, Tabs, type TabsProps } from 'design-system';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { useGetOrganizationQuery } from 'stores/organizations/organizationsApi';
import InfosTab from './tabs/InfosTab';
import MembersTab from './tabs/MembersTab';

export default function OrganizationSettings() {
  const { t } = useTranslation();
  const { organizationID } = useParams();
  const { user } = useOutletContext<{ user: User }>();
  const { data: organization, isLoading } = useGetOrganizationQuery(
    organizationID || '',
  );

  const isAdmin = useMemo(() => {
    return organization?.members
      .filter((perm) => perm.level === PERMISSIONS.ADMIN)
      .some((perm) => perm.member.id === user.id);
  }, [organization?.members, user.id]);

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: t('organization.settings.infos.title'),
        children: organization && <InfosTab organization={organization} />,
      },
      {
        key: '2',
        label: t('organization.settings.members.title'),
        children: organization && <MembersTab organization={organization} />,
      },
    ],
    [organization, t],
  );

  if (!isAdmin && !isLoading) {
    return <Navigate to={`/organizations/${organizationID}`} />;
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
      <div className='gap-4 py-8'>
        <Tabs
          defaultActiveKey='1'
          items={items}
        />
      </div>
    </Fragment>
  );
}
