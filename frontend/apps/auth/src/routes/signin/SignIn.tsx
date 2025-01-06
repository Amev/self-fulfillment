import { Form } from 'antd';
import cx from 'classnames';
import { Button, Input, TextLink, Title } from 'design-system';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import PageLayout from 'components/layout/PageLayout';
import Google from 'components/providers/Google';
import useSetAuthCodeParams from 'hooks/useSetAuthCodeParam';
import type { RedirectURIContext } from 'routes/Router';
import { useSignInCredentialsMutation } from 'stores/auth/credentialsApi';

export default function SignIn() {
  const { generateURI, redirectURI } = useOutletContext<RedirectURIContext>();
  const { t } = useTranslation();
  const [
    signInCredentials,
    {
      data: signInCredentialsResult,
      isError: signInCredentialsIsError,
      isLoading: signInCredentialsIsLoading,
    },
  ] = useSignInCredentialsMutation();
  const onFinish = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      signInCredentials({ email, password });
    },
    [signInCredentials],
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

  useSetAuthCodeParams(signInCredentialsResult?.code);

  if (signInCredentialsResult && signInCredentialsResult.mfa) {
    return <Navigate to={generateURI('/mfa')} />;
  }

  return (
    <PageLayout>
      <Title level={3}>{t('sign-in.title')}</Title>
      <Form
        className='w-full'
        layout='vertical'
        name='signin'
        onFinish={onFinish}
        validateMessages={feedbackMessages}
        requiredMark={false}
        noValidate
      >
        <Form.Item
          name='email'
          label={t('sign-in.email.label')}
          rules={[{ required: true, type: 'email' }]}
        >
          <Input
            placeholder={t('sign-in.email.placeholder')}
            size='large'
            type='email'
            required
          />
        </Form.Item>
        <Form.Item
          name='password'
          label={t('sign-in.password.label')}
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t('sign-in.password.placeholder')}
            size='large'
            type='password'
            required
          />
        </Form.Item>
        <div
          className={cx(
            'mb-3 text-sm font-medium leading-6 text-center text-red-500',
            { invisible: !signInCredentialsIsError },
          )}
        >
          {t('sign-in.errors.credentials')}
        </div>
        <Button
          className='w-full'
          loading={signInCredentialsIsLoading}
          htmlType='submit'
          size='large'
        >
          {t('sign-in.submit')}
        </Button>
      </Form>
      <div className='flex items-center w-full gap-x-3'>
        <div className='flex-grow h-[1px] bg-neutral-300' />
        <div className=''>{t('sign-in.divider')}</div>
        <div className='flex-grow h-[1px] bg-neutral-300' />
      </div>
      <Google redirectURI={redirectURI} />
      <div>
        <Link to={generateURI('/sign-up')}>
          <span>{t('sign-in.sign-up.desc')}</span>{' '}
          <TextLink>{t('sign-in.sign-up.action')}</TextLink>
        </Link>
        <Link
          to={generateURI('/forgot-password')}
          className='block mt-3 text-sm font-semibold text-center text-black underline hover:text-black hover:underline'
        >
          <TextLink className='!text-sm'>
            {t('sign-in.forgot-password.action')}
          </TextLink>
        </Link>
      </div>
    </PageLayout>
  );
}
