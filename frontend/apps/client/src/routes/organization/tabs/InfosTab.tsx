import { Organization } from 'common-types';
import { Form, Input, Card, Button } from 'design-system';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LogoUpload from 'components/organizations/LogoUpload';
import {
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from 'stores/organizations/organizationsApi';

interface InfosTabProps {
  organization: Organization;
}
export default function InfosTab({ organization }: InfosTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const onSave = useCallback(
    (data: any) => {
      updateOrganization({
        id: organization.info.id,
        enableRedeemCode: true,
        name: data.name,
      });
    },
    [organization.info.id, updateOrganization],
  );
  const onDelete = useCallback(() => {
    deleteOrganization(organization.info.id);
    navigate(`/`);
  }, [deleteOrganization, navigate, organization.info.id]);

  return (
    <div className='flex flex-col w-full mt-4 gap-y-8'>
      <div className='flex flex-row items-start w-full gap-x-2'>
        <LogoUpload organizationInfo={organization.info} />
        <div className='flex-grow'>
          <Form
            key={organization.info.id}
            name='signup-confirm'
            onFinish={onSave}
            layout='vertical'
            requiredMark={false}
            initialValues={{ name: organization.info.name }}
            className='flex gap-x-2'
          >
            <Form.Item
              name='name'
              className='w-full m-0'
              label={t('organization.settings.infos.name')}
              rules={[{ required: true }]}
            >
              <Input
                placeholder={t('organization.settings.infos.name')}
                required
              />
            </Form.Item>
            <Button
              loading={false}
              htmlType='submit'
              className='self-end'
            >
              {t('organization.settings.infos.submit')}
            </Button>
          </Form>
        </div>
      </div>
      <Card className='w-full'>
        <div className='flex flex-col items-center font-bold text-red-500 gap-y-8'>
          <span>{t('organization.settings.infos.danger.title')}</span>
          <Button
            className='w-56'
            onClick={onDelete}
          >
            {t('organization.settings.infos.danger.action')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
