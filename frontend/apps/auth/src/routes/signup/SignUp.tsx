import { Form } from 'antd';
import {
  Button,
  Input,
  TextLink,
  Title,
  PasswordInput,
  usePasswordValidationRules,
} from 'design-system';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import PageLayout from 'components/layout/PageLayout';
import type { RedirectURIContext } from 'routes/Router';
import { useSignUpCredentialsMutation } from 'stores/auth/credentialsApi';

const FIXED_HEIGHT_TO_HIDE_ANTD_ERRORS = 'h-[204px]';

export default function SignUp() {
  const { generateURI } = useOutletContext<RedirectURIContext>();
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
  const [
    signUpCredentials,
    {
      isLoading: signUpCredentialsIsLoading,
      isSuccess: signUpCredentialsIsSuccess,
    },
  ] = useSignUpCredentialsMutation();
  const onFinish = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      signUpCredentials({ email, password });
    },
    [signUpCredentials],
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
  const rules = usePasswordValidationRules(passwordValidationMessages);

  if (signUpCredentialsIsSuccess) {
    return <Navigate to={generateURI('/confirm')} />;
  }

  return (
    <PageLayout>
      <Title level={3}>{t('sign-up.title')}</Title>
      <Form
        className='w-full'
        layout='vertical'
        name='signup'
        onFinish={onFinish}
        validateMessages={feedbackMessages}
        requiredMark={false}
        noValidate
      >
        <Form.Item
          label={t('sign-up.email.label')}
          name='email'
          rules={[{ required: true, type: 'email' }]}
        >
          <Input
            placeholder={t('sign-up.email.placeholder')}
            size='large'
            type='email'
            required
          />
        </Form.Item>
        <Form.Item
          className={`${FIXED_HEIGHT_TO_HIDE_ANTD_ERRORS} overflow-hidden`}
          label={t('sign-up.password.label')}
          name='password'
          rules={rules}
        >
          <PasswordInput
            passwordValidationMessages={passwordValidationMessages}
            placeholder={t('sign-up.password.placeholder')}
          />
        </Form.Item>
        <Button
          className='w-full'
          htmlType='submit'
          loading={signUpCredentialsIsLoading}
          size='large'
        >
          {t('sign-up.submit')}
        </Button>
      </Form>
      <Link to={generateURI('/sign-in')}>
        <span>{t('sign-up.sign-in.desc')}</span>{' '}
        <TextLink>{t('sign-up.sign-in.action')}</TextLink>
      </Link>
    </PageLayout>
  );
}
