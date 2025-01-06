import { UserOutlined } from '@ant-design/icons';
import { User, Organization, Permission, PERMISSIONS } from 'common-types';
import {
  Form,
  Input,
  Card,
  List,
  Text,
  Avatar,
  Select,
  Button,
  message,
} from 'design-system';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import {
  useInviteUserMutation,
  useUpdateUserPermissionMutation,
} from 'stores/organizations/organizationsApi';

interface MembersTabProps {
  organization: Organization;
}
export default function MembersTab({ organization }: MembersTabProps) {
  const { t } = useTranslation();
  const { user } = useOutletContext<{ user: User }>();
  const [updateMemberPermission] = useUpdateUserPermissionMutation();
  const [inviteMember] = useInviteUserMutation();

  const feedbackMessages = useMemo(
    () => ({
      required: t('organization.settings.members.errors.required'),
      types: {
        email: t('organization.settings.members.errors.email'),
      },
    }),
    [t],
  );

  const reedemURI = useMemo(() => {
    return `${import.meta.env.VITE_ROOT_API_URL}/organizations/${
      organization.info.id
    }/redeem/?code=${organization.info.code}`;
  }, [organization.info.code, organization.info.id]);

  const onCopy = useCallback(() => {
    message.success(t('organization.settings.members.copy-success'));
    navigator.clipboard.writeText(reedemURI);
  }, [reedemURI, t]);

  const onChangeRight = useCallback(
    (userID: string) => (permission: Permission) => {
      updateMemberPermission({
        id: organization.info.id,
        userID,
        permission,
      });
    },
    [organization.info.id, updateMemberPermission],
  );

  const onInviteMember = useCallback(
    (data: any) => {
      inviteMember({
        id: organization.info.id,
        email: data.email,
        permission: data.permission,
      });
    },
    [inviteMember, organization.info.id],
  );

  return (
    <div className='flex flex-col w-full mt-2 gap-y-8'>
      <Text strong>
        {t('organization.settings.members.count', {
          count: organization.members.length,
        })}
      </Text>
      <List
        dataSource={organization.members}
        renderItem={(right) => {
          return (
            <List.Item>
              <div>
                <div className='flex flex-row gap-x-2'>
                  <Avatar
                    size='large'
                    src={right.member.avatar}
                  >
                    {`${right.member?.firstName?.charAt(0) || ''}${
                      right.member?.lastName?.charAt(0) || ''
                    }` || <UserOutlined />}
                  </Avatar>
                  <div className='flex flex-col self-center gap-y-0'>
                    <span className='font-semibold'>
                      {right.member.firstName} {right.member.lastName}{' '}
                      {right.member.id === user.id
                        ? `(${t('organization.settings.members.you')})`
                        : ''}
                    </span>
                    <span>{right.member.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <Select
                  className='w-28'
                  disabled={right.member.id === user.id}
                  defaultValue={right.level}
                  onChange={onChangeRight(right.member.id)}
                  options={[
                    {
                      value: PERMISSIONS.ADMIN,
                      label: t(
                        'organization.settings.members.permissions.admin',
                      ),
                    },
                    {
                      value: PERMISSIONS.USER,
                      label: t(
                        'organization.settings.members.permissions.user',
                      ),
                    },
                  ]}
                />
              </div>
            </List.Item>
          );
        }}
      />
      <Card>
        <div className='flex flex-col gap-2'>
          <span>{t('organization.settings.members.invite-link')}</span>
          <div className='flex flex-row gap-2'>
            <Text className='box-border flex-grow px-3 py-1 overflow-x-auto border rounded-md whitespace-nowrap'>
              {reedemURI}
            </Text>
            <Button onClick={onCopy}>
              {t('organization.settings.members.copy')}
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <Form
          noValidate
          layout='vertical'
          onFinish={onInviteMember}
          requiredMark={false}
          validateMessages={feedbackMessages}
          className='flex flex-row justify-between gap-x-2'
          initialValues={{ email: '', permission: PERMISSIONS.USER }}
        >
          <Form.Item
            name='email'
            className='w-full'
            label={t('organization.settings.members.invite-email')}
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item className='self-end'>
            <Button htmlType='submit'>
              {t('organization.settings.members.invite')}
            </Button>
          </Form.Item>
          <Form.Item
            name='permission'
            className='self-end'
          >
            <Select
              options={[
                {
                  value: PERMISSIONS.ADMIN,
                  label: t('organization.settings.members.permissions.admin'),
                },
                {
                  value: PERMISSIONS.USER,
                  label: t('organization.settings.members.permissions.user'),
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
