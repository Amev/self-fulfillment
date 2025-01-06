import { CheckCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import cx from 'classnames';
import { useRTKQueryErrorStatusCode } from 'common-hooks';
import { Button, Input, Text, Title } from 'design-system';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useMemo, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import { useTranslation } from 'react-i18next';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import {
  useConfirmMfaWithOTPMutation,
  useRequestMfaOTPMutation,
} from 'stores/user/securityProfileApi';

interface ActivateMfaProps {
  userID: string;
}

export default function ActivateMfa({ userID }: ActivateMfaProps) {
  const { t } = useTranslation();
  const VALIDATE_MESSAGES = useMemo(
    () => ({
      required: t(
        'profile.credentials-informations.mfa.request-change.errors.required',
      ),
    }),
    [t],
  );

  const [localPhone, setLocalPhone] = useState('');
  const [
    requestMfaOTP,
    {
      isLoading: requestMfaOTPLoading,
      error: requestMfaOTPError,
      isSuccess: requestMfaOTPSuccess,
    },
  ] = useRequestMfaOTPMutation();
  const requestMfaOTPErrorStatusCode =
    useRTKQueryErrorStatusCode(requestMfaOTPError);
  const [
    confirmMfaOTP,
    {
      isLoading: confirmMfaOTPLoading,
      error: confirmMfaOTPError,
      isSuccess: confirmMfaOTPSuccess,
    },
  ] = useConfirmMfaWithOTPMutation();
  const confirmPhoneOTPErrorStatusCode =
    useRTKQueryErrorStatusCode(confirmMfaOTPError);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const onFinish = useCallback(
    ({ phone, password }: { phone: string; password: string }) => {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      setLocalPhone(formattedPhone);
      requestMfaOTP({ userID, phone: formattedPhone, password });
    },
    [requestMfaOTP, userID],
  );

  const onPhoneChange = useCallback(
    (newPhone: string, newCountry: CountryData) => {
      setLocalPhone(newPhone);
      const isValid = isValidPhoneNumber(
        newPhone.substring(2),
        newCountry.countryCode.toUpperCase() as CountryCode,
      );
      setIsPhoneValid(isValid);
    },
    [],
  );

  const onFinishCode = useCallback(
    (otp: string) => {
      if (otp.length === 6) {
        confirmMfaOTP({ userID, otp, phone: localPhone });
      }
    },
    [confirmMfaOTP, localPhone, userID],
  );

  if (confirmMfaOTPSuccess) {
    return (
      <div className='flex flex-col justify-center py-8 text-center gap-y-4'>
        <Title level={4}>
          {t('profile.credentials-informations.mfa.success.title')}
        </Title>
        <CheckCircleOutlined className='text-7xl !text-[#12F16B] self-center' />
      </div>
    );
  }

  return (
    <div className='flex justify-center text-center'>
      {requestMfaOTPSuccess ? (
        <div className='flex flex-col justify-center px-4 py-8 w-80 gap-y-4'>
          <Title level={4}>
            {t('profile.credentials-informations.mfa.confirm-change.title')}
          </Title>
          <Text>
            {t('profile.credentials-informations.mfa.confirm-change.content')}
          </Text>
          <AuthCode
            containerClassName='flex flex-row'
            inputClassName='bg-white border-secondary w-1/2 rounded-xl mx-1 text-xl font-bold text-center'
            allowedCharacters='numeric'
            onChange={onFinishCode}
            disabled={confirmMfaOTPLoading}
          />
          <div
            className={cx('text-sm font-medium leading-6 text-red-500', {
              invisible: !confirmMfaOTPError,
            })}
          >
            {t([
              `profile.credentials-informations.mfa.confirm-change.errors.${confirmPhoneOTPErrorStatusCode}`,
              'profile.credentials-informations.mfa.confirm-change.errors.default',
            ])}
          </div>
          <Text>
            {t(
              'profile.credentials-informations.mfa.confirm-change.code-validity',
            )}
          </Text>
        </div>
      ) : (
        <div className='flex flex-col px-4 py-8 gap-y-4'>
          <Title level={4}>
            {t('profile.credentials-informations.mfa.request-change.title')}
          </Title>
          <Form
            name='activate-mfa'
            validateMessages={VALIDATE_MESSAGES}
            onFinish={onFinish}
          >
            <Form.Item name='phone'>
              <PhoneInput
                specialLabel=''
                countryCodeEditable={false}
                value={localPhone}
                onChange={onPhoneChange}
                containerClass='flex-grow'
                inputClass='rounded-md border-neutral-300 !focus:shadow-none'
                country='fr'
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
                  'profile.credentials-informations.mfa.request-change.password-placeholder',
                )}
              />
            </Form.Item>
            <div
              className={cx('mb-3 text-sm font-medium leading-6 text-red-500', {
                invisible: !requestMfaOTPError,
              })}
            >
              {t([
                `profile.credentials-informations.mfa.request-change.errors.${requestMfaOTPErrorStatusCode}`,
                'profile.credentials-informations.mfa.request-change.errors.default',
              ])}
            </div>
            <Form.Item>
              <Button
                htmlType='submit'
                className='flex-shrink-0'
                disabled={!isPhoneValid}
                loading={requestMfaOTPLoading}
                size='large'
              >
                {t(
                  'profile.credentials-informations.mfa.request-change.send-button',
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
