import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditOutlined,
} from '@ant-design/icons';
import { Form } from 'antd';
import { ACCOUNT_STATUS, User } from 'common-types';
import { Button, Card, Input, Modal } from 'design-system';
import { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActivateMfa from './ActivateMfa';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';

interface CredentialsInformationsProps {
  user: User;
}

export default function CredentialsInformations({
  user,
}: CredentialsInformationsProps) {
  const { t } = useTranslation();
  const [changeEmailModalIsOpen, setChangeEmailModalIsOpen] = useState(false);
  const toggleChangeEmailModal = useCallback(
    () => setChangeEmailModalIsOpen((prev) => !prev),
    [],
  );
  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);
  const toggleChangePasswordModal = useCallback(
    () => setChangePasswordModalIsOpen((prev) => !prev),
    [],
  );
  const [activateMfaModalIsOpen, setActivateMfaModalIsOpen] = useState(false);
  const toggleActivateMfaModal = useCallback(
    () => setActivateMfaModalIsOpen((prev) => !prev),
    [],
  );

  return (
    <Fragment>
      <Card className='w-full h-auto lg:h-full'>
        <Form layout='vertical'>
          <Form.Item label={t('profile.credentials-informations.email.label')}>
            <Input.Group
              className='!flex !flex-row'
              compact
            >
              <Input
                className='flex-grow'
                value={user.email}
                disabled
              />
              {user.account_status === ACCOUNT_STATUS.COGNITO && (
                <Button
                  className='flex-shrink-0 !rounded-l-none'
                  onClick={toggleChangeEmailModal}
                >
                  <EditOutlined />
                </Button>
              )}
            </Input.Group>
          </Form.Item>
          {user.account_status === ACCOUNT_STATUS.COGNITO && (
            <Form.Item
              label={t('profile.credentials-informations.password.label')}
            >
              <Input.Group
                className='!flex !flex-row'
                compact
              >
                <Input
                  className='flex-grow'
                  value='************'
                  disabled
                />
                <Button
                  className='flex-shrink-0 !rounded-l-none'
                  onClick={toggleChangePasswordModal}
                >
                  <EditOutlined />
                </Button>
              </Input.Group>
            </Form.Item>
          )}
          <MfaBlock
            user={user}
            onActivate={toggleActivateMfaModal}
          />
        </Form>
      </Card>
      <Modal
        open={changeEmailModalIsOpen}
        onCancel={toggleChangeEmailModal}
        footer={null}
      >
        <UpdateEmail userID={user.id} />
      </Modal>
      <Modal
        open={changePasswordModalIsOpen}
        onCancel={toggleChangePasswordModal}
        footer={null}
      >
        <UpdatePassword userID={user.id} />
      </Modal>
      <Modal
        open={activateMfaModalIsOpen}
        onCancel={toggleActivateMfaModal}
        footer={null}
      >
        <ActivateMfa userID={user.id} />
      </Modal>
    </Fragment>
  );
}

interface MfaBlockProps {
  user: User;
  onActivate: () => void;
}

function MfaBlock({ user, onActivate }: MfaBlockProps) {
  const { t } = useTranslation();
  if (user.account_status === ACCOUNT_STATUS.COGNITO && user.mfa) {
    return (
      <div className='flex flex-row text-green-400 gap-x-2'>
        <CheckCircleFilled />
        {t('profile.credentials-informations.mfa.activated-message')}
      </div>
    );
  }

  if (user.account_status === ACCOUNT_STATUS.COGNITO && !user.mfa) {
    return (
      <div>
        <div className='flex flex-row text-red-600 gap-x-2'>
          <CloseCircleFilled />
          {t('profile.credentials-informations.mfa.not-activated-message')}
        </div>
        <Button
          type='link'
          onClick={onActivate}
        >
          {t('profile.credentials-informations.mfa.activate-button')}
        </Button>
      </div>
    );
  }

  return false;
}
