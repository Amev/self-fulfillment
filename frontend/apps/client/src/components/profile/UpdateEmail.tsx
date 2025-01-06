import { CheckCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import cx from 'classnames';
import { useRTKQueryErrorStatusCode } from 'common-hooks';
import { Button, Input, Title, Text } from 'design-system';
import { useCallback, useMemo, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import { useTranslation } from 'react-i18next';
import {
  useConfirmMailWithOTPMutation,
  useRequestMailOTPMutation,
} from 'stores/user/securityProfileApi';

export default function UpdateEmail({ userID }: { userID: string }) {
  const { t } = useTranslation();
  const VALIDATE_MESSAGES = useMemo(
    () => ({
      required: t(
        'profile.credentials-informations.change-email.request-change.errors.required',
      ),
      types: {
        email: t(
          'profile.credentials-informations.change-email.request-change.errors.incorrect-email',
        ),
      },
    }),
    [t],
  );
  const [
    requestMailOTP,
    {
      isLoading: requestMailOTPLoading,
      error: requestMailOTPError,
      isSuccess: requestMailOTPSuccess,
    },
  ] = useRequestMailOTPMutation();
  const requestMailOTPErrorStatusCode =
    useRTKQueryErrorStatusCode(requestMailOTPError);
  const [
    confirmMailOTP,
    {
      // isLoading: confirmMailOTPLoading,
      error: confirmMailOTPError,
      isSuccess: confirmMailOTPSuccess,
    },
  ] = useConfirmMailWithOTPMutation();
  const confirmMailOTPErrorStatusCode =
    useRTKQueryErrorStatusCode(confirmMailOTPError);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const onSubmitNewEmail = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      requestMailOTP({ userID, email, password });
      setNewEmail(email);
      setCurrentPassword(password);
    },
    [requestMailOTP, userID],
  );

  const resendCode = useCallback(() => {
    requestMailOTP({ userID, email: newEmail, password: currentPassword });
  }, [requestMailOTP, userID, newEmail, currentPassword]);

  const onSubmitOTP = useCallback(
    (otp: string) => {
      if (otp.length === 6) {
        confirmMailOTP({ userID, otp, email: newEmail });
      }
    },
    [confirmMailOTP, newEmail, userID],
  );

  if (confirmMailOTPSuccess) {
    return (
      <div className='flex flex-col justify-center py-8 text-center gap-y-4'>
        <Title level={4}>
          {t('profile.credentials-informations.change-email.success.title')}
        </Title>
        <CheckCircleOutlined className='text-7xl !text-[#12F16B] self-center' />
      </div>
    );
  }

  return (
    <div className='flex justify-center text-center'>
      {requestMailOTPSuccess ? (
        <div className='flex flex-col justify-center px-4 py-8 w-80 gap-y-4'>
          <Title level={4}>
            {t(
              'profile.credentials-informations.change-email.confirm-change.title',
            )}
          </Title>
          <Text>
            {t(
              'profile.credentials-informations.change-email.confirm-change.content',
            )}
          </Text>
          <AuthCode
            containerClassName='flex flex-row'
            inputClassName='bg-white border-secondary w-1/2 rounded-xl mx-1 text-xl font-bold text-center'
            allowedCharacters='numeric'
            onChange={onSubmitOTP}
          />
          <div
            className={cx('text-sm font-medium leading-6 text-red-500', {
              invisible: !confirmMailOTPError,
            })}
          >
            {t([
              `profile.credentials-informations.change-email.confirm-change.errors.${confirmMailOTPErrorStatusCode}`,
              'profile.credentials-informations.change-email.confirm-change.errors.default',
            ])}
          </div>
          <Text className='!text-xs'>
            {t(
              'profile.credentials-informations.change-email.confirm-change.code-validity',
            )}
          </Text>
          <Button
            type='link'
            className='!text-xs'
            onClick={resendCode}
          >
            {t(
              'profile.credentials-informations.change-email.confirm-change.resend-button',
            )}
          </Button>
        </div>
      ) : (
        <div className='flex flex-col px-4 py-8 gap-y-4'>
          <Title level={4}>
            {t(
              'profile.credentials-informations.change-email.request-change.title',
            )}
          </Title>
          <Form
            name='new-email'
            validateMessages={VALIDATE_MESSAGES}
            onFinish={onSubmitNewEmail}
          >
            <Form.Item
              name='email'
              rules={[{ required: true, type: 'email' }]}
            >
              <Input
                size='large'
                defaultValue={newEmail}
                placeholder='e-mail'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true }]}
            >
              <Input
                size='large'
                type='password'
                placeholder={t(
                  'profile.credentials-informations.change-email.request-change.password-placeholder',
                )}
              />
            </Form.Item>
            <Form.Item>
              <div
                className={cx('text-sm font-medium leading-6 text-red-500', {
                  invisible: requestMailOTPError,
                })}
              >
                {t([
                  `profile.credentials-informations.change-email.request-change.errors.${requestMailOTPErrorStatusCode}`,
                  'profile.credentials-informations.change-email.request-change.errors.default',
                ])}
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                loading={requestMailOTPLoading}
                htmlType='submit'
              >
                {t(
                  'profile.credentials-informations.change-email.request-change.send-button',
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
