import { CheckCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import cx from 'classnames';
import { useRTKQueryErrorStatusCode } from 'common-hooks';
import {
  Button,
  Input,
  usePasswordValidationRules,
  PasswordInput,
  Title,
} from 'design-system';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdatePasswordMutation } from 'stores/user/securityProfileApi';

export default function UpdatePassword({ userID }: { userID: string }) {
  const { t } = useTranslation();

  const passwordValidationMessages = useMemo(
    () => ({
      LENGTH: t(
        'profile.credentials-informations.change-password.request-change.password-validation.length',
      ),
      LOWERCASE: t(
        'profile.credentials-informations.change-password.request-change.password-validation.lowercase',
      ),
      UPPERCASE: t(
        'profile.credentials-informations.change-password.request-change.password-validation.uppercase',
      ),
      DIGIT: t(
        'profile.credentials-informations.change-password.request-change.password-validation.digit',
      ),
      SYMBOL: t(
        'profile.credentials-informations.change-password.request-change.password-validation.symbol',
      ),
      SPACES: t(
        'profile.credentials-informations.change-password.request-change.password-validation.spaces',
      ),
    }),
    [t],
  );

  const rules = usePasswordValidationRules(passwordValidationMessages);
  const VALIDATE_MESSAGES = useMemo(
    () => ({
      required: t(
        'profile.credentials-informations.change-password.request-change.errors.required',
      ),
    }),
    [t],
  );
  const [
    updatePassword,
    {
      isLoading: updatePasswordLoading,
      error: updatePasswordError,
      isSuccess: updatePasswordSuccess,
    },
  ] = useUpdatePasswordMutation();
  const updatePasswordErrorStatusCode =
    useRTKQueryErrorStatusCode(updatePasswordError);
  const onSubmitPassword = useCallback(
    ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      updatePassword({ userID, currentPassword, newPassword });
    },
    [updatePassword, userID],
  );

  if (updatePasswordSuccess) {
    return (
      <div className='flex flex-col justify-center py-8 text-center gap-y-4'>
        <Title level={4}>
          {t('profile.credentials-informations.change-password.success.title')}
        </Title>
        <CheckCircleOutlined className='text-7xl !text-[#12F16B] self-center' />
      </div>
    );
  }

  return (
    <div className='flex justify-center text-center'>
      <div className='flex flex-col justify-center px-4 py-8 w-80 gap-y-4'>
        <Title level={4}>
          {t(
            'profile.credentials-informations.change-password.request-change.title',
          )}
        </Title>
        <Form
          layout='vertical'
          name='new-email'
          validateMessages={VALIDATE_MESSAGES}
          onFinish={onSubmitPassword}
          requiredMark={false}
          noValidate
        >
          <Form.Item
            name='currentPassword'
            rules={[{ required: true }]}
          >
            <Input
              size='large'
              type='password'
              placeholder={t(
                'profile.credentials-informations.change-password.request-change.current-password-placeholder',
              )}
            />
          </Form.Item>
          <Form.Item
            className='h-[175px] overflow-hidden'
            name='newPassword'
            rules={rules}
          >
            <PasswordInput
              placeholder={t(
                'profile.credentials-informations.change-password.request-change.new-password-placeholder',
              )}
              passwordValidationMessages={passwordValidationMessages}
            />
          </Form.Item>
          <Form.Item>
            <div
              className={cx('text-sm font-medium leading-6 text-red-500', {
                invisible: updatePasswordError,
              })}
            >
              {t([
                `profile.credentials-informations.change-password.request-change.errors.${updatePasswordErrorStatusCode}`,
                'profile.credentials-informations.change-password.request-change.errors.default',
              ])}
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              loading={updatePasswordLoading}
              htmlType='submit'
            >
              {t(
                'profile.credentials-informations.change-password.request-change.submit-button',
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
