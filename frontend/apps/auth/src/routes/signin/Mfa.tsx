import { Form } from 'antd';
import cx from 'classnames';
import { useRTKQueryErrorStatusCode } from 'common-hooks';
import { Button, Input, Text, Title } from 'design-system';
import { Fragment, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Navigate, useOutletContext } from 'react-router-dom';
import PageLayout from 'components/layout/PageLayout';
import useSetAuthCodeParams from 'hooks/useSetAuthCodeParam';
import type { RedirectURIContext } from 'routes/Router';
import { getCredentials, getMfaCredentials } from 'stores/auth/authSlice';
import {
  useConfirmCredentialsMfaMutation,
  useSignInCredentialsMutation,
} from 'stores/auth/credentialsApi';
import { useAppSelector } from 'stores/hooks';

export default function Mfa() {
  const { generateURI } = useOutletContext<RedirectURIContext>();
  const mfaCredentials = useAppSelector(getMfaCredentials);
  const credentials = useAppSelector(getCredentials);
  const { t } = useTranslation();
  const [
    confirmCredentialsMfa,
    {
      data: confirmCredentialsMfaResult,
      isError: confirmCredentialsMfaIsError,
      isLoading: confirmCredentialsMfaIsLoading,
    },
  ] = useConfirmCredentialsMfaMutation();
  const [
    signInCredentials,
    {
      error: signInCredentialsError,
      isSuccess: signInCredentialsIsSuccess,
      isLoading: signInCredentialsIsLoading,
    },
  ] = useSignInCredentialsMutation();
  const signInCredentialsErrorStatusCode = useRTKQueryErrorStatusCode(
    signInCredentialsError,
  );
  const resendCode = useCallback(() => {
    if (credentials) {
      signInCredentials({
        email: credentials?.email,
        password: credentials?.password,
      });
    }
  }, [credentials, signInCredentials]);

  const onFinish = useCallback(
    ({ otp }: { otp: string }) => {
      if (mfaCredentials) {
        confirmCredentialsMfa({
          otp,
          csrf: mfaCredentials.csrf || '',
        });
      }
    },
    [confirmCredentialsMfa, mfaCredentials],
  );
  const feedbackMessages = useMemo(
    () => ({
      required: t('sign-in.errors.required'),
    }),
    [t],
  );

  useSetAuthCodeParams(confirmCredentialsMfaResult?.code);

  if (!mfaCredentials || !credentials) {
    return <Navigate to={generateURI('/sign-in')} />;
  }

  return (
    <PageLayout>
      <Title level={3}>{t('mfa.title')}</Title>
      <Text>
        <Trans
          i18nKey='mfa.desc'
          values={{ phone: mfaCredentials.phone }}
          components={{ bold: <strong /> }}
        />
      </Text>
      <Form
        className='w-full'
        name='mfa-confirm'
        validateMessages={feedbackMessages}
        onFinish={onFinish}
        noValidate
        layout='vertical'
        requiredMark={false}
        initialValues={{ code: undefined }}
      >
        <Form.Item
          name='code'
          label={t('mfa.code.label')}
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t('mfa.code.placeholder')}
            required
          />
        </Form.Item>
        <div
          className={cx(
            'mb-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !confirmCredentialsMfaIsError },
          )}
        >
          {t('mfa.errors.code')}
        </div>
        <Button
          className='w-full'
          loading={confirmCredentialsMfaIsLoading}
          htmlType='submit'
          size='large'
        >
          {t('mfa.submit')}
        </Button>
      </Form>
      <div className='text-sm text-center'>
        <span>{t('mfa.resend.desc')}</span>
        <br />
        {signInCredentialsIsSuccess ? (
          <span className='!text-green-500'>
            {t('mfa.resend.confirmation')}
          </span>
        ) : (
          <Fragment>
            <Button
              className='!text-sm'
              loading={signInCredentialsIsLoading}
              onClick={resendCode}
              type='link'
            >
              {t('mfa.resend.action')}
            </Button>
            <div
              className={cx(
                'mt-3 text-sm font-medium leading-6 text-center text-red-500',
              )}
            >
              {t([
                `forgot-password.errors.${signInCredentialsErrorStatusCode}`,
                'forgot-password.errors.default',
              ])}
            </div>
          </Fragment>
        )}
      </div>
    </PageLayout>
  );
}
