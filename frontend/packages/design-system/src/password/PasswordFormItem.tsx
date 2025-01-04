/* eslint-disable react/jsx-props-no-spreading */
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
} from '@ant-design/icons';
import { Form, InputProps, Tooltip } from 'antd';
import { Rule } from 'antd/es/form';
import { Fragment, ReactNode, useMemo } from 'react';
import { Input } from '../input/Input';

interface PasswordValidationMessagesProps {
  LENGTH: string;
  LOWERCASE: string;
  UPPERCASE: string;
  DIGIT: string;
  SYMBOL: string;
  SPACES: string;
}

const PASSWORD_VALIDATION_TOOLTIPS: Record<string, string> = {
  SYMBOL: '^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ ` = + -',
};

const PASSWORD_VALIDATION_REGEX = {
  LOWERCASE: /[a-z]+/,
  UPPERCASE: /[A-Z]+/,
  DIGIT: /\d+/,
  SYMBOL: /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]|^.+\s.+$/,
  SPACES: /^[^\s]+.*[^\s]+$/,
};

export function usePasswordValidationRules(
  passwordValidationMessages: PasswordValidationMessagesProps,
) {
  const rules: Rule[] = useMemo(() => {
    return [
      () => ({
        validator(_, value) {
          if (!value || value.length < 8) {
            return Promise.reject(new Error(passwordValidationMessages.LENGTH));
          }

          return Promise.resolve();
        },
      }),
      () => ({
        validator(_, value) {
          if (!value || !PASSWORD_VALIDATION_REGEX.LOWERCASE.test(value)) {
            return Promise.reject(
              new Error(passwordValidationMessages.LOWERCASE),
            );
          }

          return Promise.resolve();
        },
      }),
      () => ({
        validator(_, value) {
          if (!value || !PASSWORD_VALIDATION_REGEX.UPPERCASE.test(value)) {
            return Promise.reject(
              new Error(passwordValidationMessages.UPPERCASE),
            );
          }

          return Promise.resolve();
        },
      }),
      () => ({
        validator(_, value) {
          if (!value || !PASSWORD_VALIDATION_REGEX.DIGIT.test(value)) {
            return Promise.reject(new Error(passwordValidationMessages.DIGIT));
          }

          return Promise.resolve();
        },
      }),
      () => ({
        validator(_, value) {
          if (!value || !PASSWORD_VALIDATION_REGEX.SYMBOL.test(value)) {
            return Promise.reject(new Error(passwordValidationMessages.SYMBOL));
          }

          return Promise.resolve();
        },
      }),
      () => ({
        validator(_, value) {
          if (!value || !PASSWORD_VALIDATION_REGEX.SPACES.test(value)) {
            return Promise.reject(new Error(passwordValidationMessages.SPACES));
          }

          return Promise.resolve();
        },
      }),
    ];
  }, [passwordValidationMessages]);

  return rules;
}

interface PasswordInputProps
  extends Omit<
    InputProps,
    'placeholder' | 'size' | 'status' | 'type' | 'required'
  > {
  passwordValidationMessages: PasswordValidationMessagesProps;
  placeholder?: string;
}

export function PasswordInput({
  placeholder = undefined,
  passwordValidationMessages,
  ...props
}: PasswordInputProps) {
  const { status, errors } = Form.Item.useStatus();

  return (
    <Fragment>
      <Input
        {...props}
        placeholder={placeholder}
        size='large'
        status={status === 'error' ? status : undefined}
        type='password'
        required
      />
      <div className='flex flex-col px-1 pt-3'>
        {Object.entries(passwordValidationMessages).map(([key, message]) => (
          <RuleItem
            key={key}
            isValid={!errors.includes(message)}
            message={message}
            status={status}
            tooltip={PASSWORD_VALIDATION_TOOLTIPS[key]}
          />
        ))}
      </div>
    </Fragment>
  );
}

interface RuleItemProps {
  isValid: boolean;
  message: ReactNode;
  status?: string;
  tooltip?: ReactNode;
}

function RuleItem({
  isValid,
  message,
  status = '',
  tooltip = null,
}: RuleItemProps) {
  return (
    <div className='flex items-center gap-x-2'>
      {!isValid && status !== '' && (
        <ExclamationCircleTwoTone twoToneColor='#ff0000' />
      )}
      {isValid && status !== '' && (
        <CheckCircleTwoTone twoToneColor='#1dde8a' />
      )}
      <div className='text-[rgba(0,0,0,0.5)] text-sm'>
        {message}
        {tooltip !== null && (
          <Tooltip title={tooltip}>
            <span>*</span>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
