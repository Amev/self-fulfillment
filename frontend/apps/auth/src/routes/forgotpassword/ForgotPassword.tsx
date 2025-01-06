import { Form } from 'antd';
import cx from 'classnames';
import { useRTKQueryErrorStatusCode } from 'common-hooks';
import {
  Button,
  Input,
  Text,
  TextLink,
  Title,
  PasswordInput,
} from 'design-system';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useOutletContext } from 'react-router-dom';
import PageLayout from 'components/layout/PageLayout';
import useSetAuthCodeParams from 'hooks/useSetAuthCodeParam';
import type { RedirectURIContext } from 'routes/Router';
import {
  useConfirmResetPasswordMutation,
  useRequestResetPasswordMutation,
} from 'stores/auth/credentialsApi';

export default function ForgotPassword() {
  const [
    requestResetPassword,
    {
      isLoading: requestResetPasswordIsLoading,
      isSuccess: requestResetPasswordIsSuccess,
      isError: requestResetPasswordIsError,
      error: requestResetPasswordError,
    },
  ] = useRequestResetPasswordMutation();
  const requestResetPasswordErrorStatusCode = useRTKQueryErrorStatusCode(
    requestResetPasswordError,
  );
  const [userEmail, setUserEmail] = useState('');
  const onSubmitEmail = useCallback(
    (email: string) => {
      requestResetPassword(email);
      setUserEmail(email);
    },
    [requestResetPassword],
  );

  return (
    <PageLayout>
      {!requestResetPasswordIsSuccess && (
        <TemporaryCodeRequestForm
          onSubmitEmail={onSubmitEmail}
          requestResetPasswordErrorStatusCode={
            requestResetPasswordErrorStatusCode
          }
          requestResetPasswordIsError={requestResetPasswordIsError}
          requestResetPasswordIsLoading={requestResetPasswordIsLoading}
        />
      )}
      {requestResetPasswordIsSuccess && <NewPasswordForm email={userEmail} />}
    </PageLayout>
  );
}

interface TemporaryCodeRequestFormProps {
  onSubmitEmail: (email: string) => void;
  requestResetPasswordErrorStatusCode?: string | number;
  requestResetPasswordIsError: boolean;
  requestResetPasswordIsLoading: boolean;
}

function TemporaryCodeRequestForm({
  onSubmitEmail,
  requestResetPasswordErrorStatusCode = undefined,
  requestResetPasswordIsError,
  requestResetPasswordIsLoading,
}: TemporaryCodeRequestFormProps) {
  const { generateURI } = useOutletContext<RedirectURIContext>();
  const { t } = useTranslation();
  const feedbackMessages = useMemo(
    () => ({
      required: t('sign-in.errors.required'),
      types: {
        email: t('sign-in.errors.types.email'),
      },
    }),
    [t],
  );
  const onSubmit = useCallback(
    ({ email }: { email: string }) => {
      onSubmitEmail(email);
    },
    [onSubmitEmail],
  );

  return (
    <Fragment>
      <Title level={3}>{t('forgot-password.email.title')}</Title>
      <Text className='text-center'>{t('forgot-password.email.desc')}</Text>
      <Form
        className='w-full'
        layout='vertical'
        name='reset-password-demand'
        onFinish={onSubmit}
        requiredMark={false}
        validateMessages={feedbackMessages}
        noValidate
      >
        <Form.Item
          name='email'
          label={t('forgot-password.email.label')}
          rules={[{ required: true, type: 'email' }]}
        >
          <Input
            type='email'
            placeholder={t('forgot-password.email.placeholder')}
            size='large'
            required
          />
        </Form.Item>
        <div
          className={cx(
            'mb-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !requestResetPasswordIsError },
          )}
        >
          {t([
            `forgot-password.errors.${requestResetPasswordErrorStatusCode}`,
            'forgot-password.errors.default',
          ])}
        </div>
        <Button
          className='w-full'
          htmlType='submit'
          loading={requestResetPasswordIsLoading}
          size='large'
        >
          {t('forgot-password.email.submit')}
        </Button>
      </Form>
      <div>
        <Link to={generateURI('/sign-up')}>
          <span>{t('forgot-password.sign-up.desc')}</span>{' '}
          <TextLink>{t('forgot-password.sign-up.action')}</TextLink>
        </Link>
        <Link
          to={generateURI('/sign-in')}
          className='block mt-3 text-sm font-semibold text-center text-black underline hover:text-black hover:underline'
        >
          <TextLink className='!text-sm'>
            {t('forgot-password.sign-in.action')}
          </TextLink>
        </Link>
      </div>
    </Fragment>
  );
}

interface NewPasswordFormProps {
  email: string;
}

function NewPasswordForm({ email }: NewPasswordFormProps) {
  const { t } = useTranslation();
  const passwordValidationMessages = useMemo(
    () => ({
      LENGTH: t('password-validation.length'),
      LOWERCASE: t('password-validation.lowercase'),
      UPPERCASE: t('password-validation.uppercase'),
      DIGIT: t('password-validation.digit'),
      SYMBOL: t('password-validation.symbol'),
      SPACES: t('password-validation.spaces'),
    }),
    [t],
  );
  const feedbackMessages = useMemo(
    () => ({
      required: t('sign-in.errors.required'),
      types: {
        email: t('sign-in.errors.types.email'),
      },
    }),
    [t],
  );
  const [
    confirmResetPassword,
    {
      data: confirmResetPasswordResult,
      isLoading: confirmResetPasswordIsLoading,
      isError: confirmResetPasswordIsError,
    },
  ] = useConfirmResetPasswordMutation();
  const [
    requestResetPassword,
    { error: requestResetPasswordError, isError: requestResetPasswordIsError },
  ] = useRequestResetPasswordMutation();
  const requestResetPasswordErrorStatusCode = useRTKQueryErrorStatusCode(
    requestResetPasswordError,
  );
  const onSubmitNewPassword = useCallback(
    ({ otp, password }: { otp: string; password: string }) => {
      confirmResetPassword({
        email,
        otp,
        password,
      });
    },
    [confirmResetPassword, email],
  );
  const onClickDemandNewCode = useCallback(
    () => requestResetPassword(email),
    [requestResetPassword, email],
  );

  useSetAuthCodeParams(confirmResetPasswordResult?.code);

  return (
    <Fragment>
      <Title level={3}>{t('forgot-password.code.title')}</Title>
      <Text className='text-center'>
        <Trans
          i18nKey='forgot-password.code.desc'
          values={{ email }}
          components={{ bold: <strong /> }}
        />
      </Text>
      <Form
        className='w-full'
        layout='vertical'
        name='reset-password'
        onFinish={onSubmitNewPassword}
        requiredMark={false}
        validateMessages={feedbackMessages}
        noValidate
      >
        <Form.Item
          name='otp'
          label={t('forgot-password.code.label')}
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t('forgot-password.code.placeholder')}
            size='large'
            required
          />
        </Form.Item>
        <Form.Item
          name='password'
          label={t('forgot-password.password.label')}
          rules={[{ required: true }]}
        >
          <PasswordInput
            placeholder={t('forgot-password.password.placeholder')}
            passwordValidationMessages={passwordValidationMessages}
          />
        </Form.Item>
        <div
          className={cx(
            'mb-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !confirmResetPasswordIsError },
          )}
        >
          {t('forgot-password.errors.default')}
        </div>
        <Button
          className='w-full'
          loading={confirmResetPasswordIsLoading}
          htmlType='submit'
          size='large'
        >
          {t('forgot-password.code.submit')}
        </Button>
      </Form>
      <div className='text-sm text-center'>
        <span>{t('forgot-password.resend.desc')}</span>
        <br />
        <TextLink
          className='!text-sm'
          onClick={onClickDemandNewCode}
        >
          {t('forgot-password.resend.action')}
        </TextLink>
        <div
          className={cx(
            'mt-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !requestResetPasswordIsError },
          )}
        >
          {t([
            `forgot-password.errors.${requestResetPasswordErrorStatusCode}`,
            'forgot-password.errors.default',
          ])}
        </div>
      </div>
    </Fragment>
  );
}
