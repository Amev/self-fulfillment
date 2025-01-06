import { Form } from 'antd';
import { User } from 'common-types';
import { Button, Card, Input, Select } from 'design-system';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarUpload from 'components/profile/AvatarUpload';
import { useUpdateUserMutation } from 'stores/user/profileApi';

interface BaseInformationsProps {
  user: User;
}

export default function BasicInformations({ user }: BaseInformationsProps) {
  const { t } = useTranslation();
  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();
  const onSaveInformations = useCallback(
    (newUser: User) => {
      updateUser({
        ...newUser,
        id: user.id,
      });
    },
    [updateUser, user.id],
  );
  const feedbackMessages = useMemo(
    () => ({
      required: t('profile.basic-informations.errors.required'),
    }),
    [t],
  );

  return (
    <Card className='w-full'>
      <Form
        layout='vertical'
        name='profile-form'
        onFinish={onSaveInformations}
        requiredMark={false}
        validateMessages={feedbackMessages}
      >
        <div className='flex flex-col items-start gap-4 lg:items-center lg:flex-row'>
          <div className='self-start flex-shrink-0'>
            <AvatarUpload user={user} />
          </div>
          <div className='grid flex-grow w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4'>
            <Form.Item
              initialValue={user.firstName}
              label={t('profile.basic-informations.firstname.label')}
              name='firstName'
              rules={[{ required: true, type: 'string' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={user.lastName}
              label={t('profile.basic-informations.lastname.label')}
              name='lastName'
              rules={[{ required: true, type: 'string' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={user.birth_date}
              label={t('profile.basic-informations.birth-date.label')}
              name='birth_date'
              rules={[{ required: false, type: 'string' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={user.gender}
              label={t('profile.basic-informations.gender.label')}
              name='gender'
              rules={[{ required: false, type: 'string' }]}
            >
              <Select
                options={[
                  {
                    value: 'M',
                    label: t('profile.basic-informations.gender.choices.male'),
                  },
                  {
                    value: 'F',
                    label: t(
                      'profile.basic-informations.gender.choices.female',
                    ),
                  },
                  {
                    value: 'N/A',
                    label: t('profile.basic-informations.gender.choices.other'),
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className='self-start flex-shrink-0 lg:self-end'>
            <Form.Item>
              <Button
                htmlType='submit'
                loading={updateUserLoading}
              >
                {t('profile.basic-informations.action')}
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Card>
  );
}
