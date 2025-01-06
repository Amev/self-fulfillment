import { Avatar, Content, Layout, Sider } from 'design-system';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import OrganizationsSelector from 'components/organizations/OrganizationsSelector';
import { useGetOrganizationsQuery } from 'stores/organizations/organizationsApi';
import { useGetUserQuery } from 'stores/user/profileApi';

export default function MainLayout() {
  const { t } = useTranslation();
  const { data: user } = useGetUserQuery();
  const { data: organizations, isLoading: fetchingOrganizations } =
    useGetOrganizationsQuery();

  return (
    <Layout
      className='!h-screen'
      hasSider
    >
      <Sider collapsed>
        <div className='flex flex-col items-center h-full pt-2 pb-12'>
          <OrganizationsSelector
            organizations={organizations}
            isLoading={fetchingOrganizations}
          />
          <div className='flex-grow' />
          <Link to='/profile'>
            <Avatar
              alt={`${user?.firstName?.charAt(0) || ''} ${
                user?.lastName || t('profile.basic-informations.avatar.default')
              }`}
              shape='circle'
              src={user?.avatar || undefined}
              size='large'
            >
              {`${user?.firstName?.charAt(0) || ''}${
                user?.lastName?.charAt(0) || ''
              }` || t('profile.basic-informations.avatar.default')}
            </Avatar>
          </Link>
        </div>
      </Sider>
      <Content className='min-h-screen overflow-y-auto'>
        <main className='flex flex-col p-8 grow'>
          <Outlet />
        </main>
      </Content>
    </Layout>
  );
}
