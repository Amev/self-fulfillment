import { Form } from 'antd';
import cx from 'classnames';
import { Button, Input, Text, Title } from 'design-system';
import { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Navigate, useOutletContext } from 'react-router-dom';
import PageLayout from 'components/layout/PageLayout';
import useSetAuthCodeParams from 'hooks/useSetAuthCodeParam';
import type { RedirectURIContext } from 'routes/Router';
import { getCredentials } from 'stores/auth/authSlice';
import {
  useConfirmCredentialsEmailMutation,
  useSignUpResendCodeMutation,
} from 'stores/auth/credentialsApi';
import { useAppSelector } from 'stores/hooks';

export default function SignUpConfirm() {
  const { generateURI } = useOutletContext<RedirectURIContext>();
  const credentials = useAppSelector(getCredentials);
  const { t } = useTranslation();
  const [
    signUpResendCode,
    {
      isLoading: signUpResendCodeIsLoading,
      isSuccess: signUpResendCodeIsSuccess,
    },
  ] = useSignUpResendCodeMutation();
  const [
    confirmCredentialsEmail,
    {
      data: confirmCredentialsEmailResult,
      isLoading: confirmCredentialsEmailIsLoading,
      isError: confirmCredentialsEmailIsError,
    },
  ] = useConfirmCredentialsEmailMutation();

  const onResend = useCallback(() => {
    signUpResendCode({ email: credentials?.email || '' });
  }, [signUpResendCode, credentials?.email]);

  const onFinish = useCallback(
    ({ otp, password }: { otp: string; password: string }) => {
      confirmCredentialsEmail({
        email: credentials?.email || '',
        otp,
        password,
      });
    },
    [credentials?.email, confirmCredentialsEmail],
  );
  const feedbackMessages = useMemo(
    () => ({
      required: t('sign-in.errors.required'),
    }),
    [t],
  );

  useSetAuthCodeParams(confirmCredentialsEmailResult?.code);

  if (!credentials) {
    return <Navigate to={generateURI('/sign-up')} />;
  }

  return (
    <PageLayout>
      <Title level={3}>{t('confirm-email.title')}</Title>
      <Text>
        <Trans
          i18nKey='confirm-email.desc'
          values={{ email: credentials?.email }}
          components={{ bold: <strong /> }}
        />
      </Text>
      <Form
        className='w-full'
        name='signup-confirm'
        validateMessages={feedbackMessages}
        onFinish={onFinish}
        noValidate
        layout='vertical'
        requiredMark={false}
        initialValues={{ code: undefined, password: credentials?.password }}
      >
        <Form.Item
          name='password'
          label={t('confirm-email.password.label')}
          rules={[{ required: true }]}
          hidden={!!credentials?.password}
        >
          <Input
            placeholder={t('confirm-email.password.placeholder')}
            size='large'
            type='password'
            required
          />
        </Form.Item>
        <Form.Item
          name='otp'
          label={t('confirm-email.code.label')}
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t('confirm-email.code.placeholder')}
            required
          />
        </Form.Item>
        <div
          className={cx(
            'mb-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !confirmCredentialsEmailIsError },
          )}
        >
          {t('sign-up.errors.invalid-code')}
        </div>
        <Button
          className='w-full'
          loading={confirmCredentialsEmailIsLoading}
          htmlType='submit'
          size='large'
        >
          {t('confirm-email.submit')}
        </Button>
      </Form>
      <div className='text-sm text-center'>
        <span>{t('confirm-email.resend.desc')}</span>
        <br />
        {!signUpResendCodeIsSuccess ? (
          <Button
            className='!text-sm'
            loading={signUpResendCodeIsLoading}
            onClick={onResend}
            type='link'
          >
            {t('confirm-email.resend.action')}
          </Button>
        ) : (
          <Text className='!text-green-500'>
            {t('confirm-email.resend.confirmation')}
          </Text>
        )}
      </div>
    </PageLayout>
  );
}
