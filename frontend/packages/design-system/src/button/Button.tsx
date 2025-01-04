/* eslint-disable react/require-default-props */
import cx from 'classnames';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  MouseEvent,
  ReactNode,
  Ref,
  forwardRef,
} from 'react';
import { Spin } from '../spin/Spin';

export type ButtonType = 'default' | 'light' | 'text' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'primary' | 'error' | 'success';
export type ButtonHTMLType = 'submit' | 'button' | 'reset';

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLElement> & AnchorHTMLAttributes<HTMLElement>,
    'type' | 'className'
  > {
  children?: ReactNode;
  className?: string;
  color?: ButtonColor;
  disabled?: boolean;
  fullWidth?: boolean;
  htmlType?: ButtonHTMLType;
  icon?: ReactNode;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  size?: ButtonSize;
  type?: ButtonType;
  [key: `data-${string}`]: string;
}

const CLASSNAMES: Record<
  ButtonColor,
  Record<ButtonType, Record<'child' | 'container' | ButtonSize, string>>
> = {
  primary: {
    default: {
      child: 'bg-black group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] text-base',
      medium: 'h-[42px] text-base',
      small: 'h-[26px] text-xs',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-black disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-black disabled:border-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-black disabled:text-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-black disabled:text-content-very-light underline',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
  },
  error: {
    default: {
      child: 'bg-error group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] text-base',
      medium: 'h-[42px] text-base',
      small: 'h-[26px] text-xs',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-error disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-error disabled:border-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-error disabled:text-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-error disabled:text-content-very-light underline',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
  },
  success: {
    default: {
      child: 'bg-success group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] text-base',
      medium: 'h-[42px] text-base',
      small: 'h-[26px] text-xs',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-success disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-success disabled:border-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-success disabled:text-content-very-light',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-success disabled:text-content-very-light underline',
      large: 'h-12 text-base',
      medium: 'h-10 text-base',
      small: 'h-6 text-xs',
    },
  },
};

export const Button = forwardRef(function ButtonComponent(
  {
    children = null,
    className = '',
    color = 'primary',
    disabled = false,
    fullWidth = false,
    href = undefined,
    htmlType = 'button',
    icon = null,
    loading = false,
    onClick = () => {},
    size = 'medium',
    type = 'default',
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const containerClassName = cx(
    'inline',
    className,
    {
      'w-full': fullWidth,
      'cursor-not-allowed': disabled || loading,
    },
    CLASSNAMES[color][type][size],
    CLASSNAMES[color][type].container,
  );
  const childClassName = cx(
    'flex items-center justify-center px-4 font-semibold leading-6 w-full h-full gap-x-2',
    CLASSNAMES[color][type].child,
  );
  const content = (
    <span className={childClassName}>
      {loading && (
        <Spin
          color={type === 'default' ? 'white' : 'black'}
          className={cx({
            'opacity-20': type !== 'default',
          })}
          size='small'
        />
      )}
      {!loading && icon !== null && icon}
      {children && <span>{children}</span>}
    </span>
  );

  if (href) {
    return (
      <a
        className={containerClassName}
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={containerClassName}
      disabled={disabled || loading}
      onClick={onClick}
      ref={ref as Ref<HTMLButtonElement>}
      type={htmlType}
      {...rest}
    >
      {content}
    </button>
  );
});

interface IconButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLElement> & AnchorHTMLAttributes<HTMLElement>,
    'type' | 'className' | 'children'
  > {
  children: ReactNode;
  className?: string;
  color?: ButtonColor;
  disabled?: boolean;
  gradient?: boolean;
  htmlType?: ButtonHTMLType;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  size?: ButtonSize;
  type?: ButtonType;
  [key: `data-${string}`]: string;
}

const ICON_CLASSNAMES: Record<
  ButtonColor,
  Record<ButtonType, Record<'child' | 'container' | ButtonSize, string>>
> = {
  primary: {
    default: {
      child: 'bg-black group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] w-[50px]',
      medium: 'h-[42px] w-[42px]',
      small: 'h-[34px] w-[34px]',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-black disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-black disabled:border-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-black disabled:text-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-black disabled:text-content-very-light underline',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
  },
  error: {
    default: {
      child: 'bg-error group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] w-[50px]',
      medium: 'h-[42px] w-[42px]',
      small: 'h-[34px] w-[34px]',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-error disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-error disabled:border-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-error disabled:text-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-error disabled:text-content-very-light underline',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
  },
  success: {
    default: {
      child: 'bg-success group-disabled:bg-content-very-light',
      container:
        'group bg-tansparent disabled:!bg-content-very-light hover:bg-white text-white hover:shadow-base disabled:hover:shadow-none',
      large: 'h-[50px] w-[50px]',
      medium: 'h-[42px] w-[42px]',
      small: 'h-[34px] w-[34px]',
    },
    light: {
      child: '',
      container:
        'bg-white/50 disabled:text-content-very-light text-success disabled:text-primary/40 hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-success disabled:border-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    text: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-success disabled:text-content-very-light',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
    link: {
      child: '',
      container:
        'bg-transparent hover:shadow-base disabled:hover:shadow-none hover:bg-white border border-transparent text-success disabled:text-content-very-light underline',
      large: 'h-12 w-12',
      medium: 'h-10 w-10',
      small: 'h-8 w-8',
    },
  },
};

export const IconButton = forwardRef(function IconButtonComponent(
  {
    children,
    className = '',
    color = 'primary',
    disabled = false,
    href = undefined,
    htmlType = 'button',
    loading = false,
    onClick = () => {},
    size = 'medium',
    type = 'default',
    ...rest
  }: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const containerClassName = cx(
    'inline',
    className,
    {
      'cursor-not-allowed': disabled || loading,
    },
    ICON_CLASSNAMES[color][type][size],
    ICON_CLASSNAMES[color][type].container,
  );
  const childClassName = cx(
    'flex flex-col items-center justify-center w-full h-full',
    ICON_CLASSNAMES[color][type].child,
  );
  const content = (
    <span className={childClassName}>
      {loading ? (
        <Spin
          color={type === 'default' ? 'white' : 'black'}
          className={cx({
            'opacity-20': type !== 'default',
          })}
          size='small'
        />
      ) : (
        <span>{children}</span>
      )}
    </span>
  );

  if (href) {
    return (
      <a
        className={containerClassName}
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={containerClassName}
      disabled={disabled || loading}
      onClick={onClick}
      ref={ref as Ref<HTMLButtonElement>}
      type={htmlType}
      {...rest}
    >
      {content}
    </button>
  );
});

interface DiamondButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLElement>,
    'type' | 'className' | 'children'
  > {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  highlighted?: boolean;
  htmlType?: ButtonHTMLType;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  success?: boolean;
  [key: `data-${string}`]: string;
}

export const DiamondButton = forwardRef(function DiamondButtonComponent(
  {
    children,
    className = '',
    disabled = false,
    highlighted = false,
    htmlType = 'button',
    loading = false,
    onClick = () => {},
    success = false,
    ...rest
  }: DiamondButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const containerClassName = cx(
    'inline rotate-45 bg-white disabled:bg-white/50 w-12 h-12 border-2 hover:shadow-base disabled:hover:shadow-none disabled:text-content-very-light disabled:hover:border-content-very-light',
    className,
    {
      'cursor-not-allowed': disabled || loading,
      'border-transparent': !highlighted && !success,
      'border-black shadow-base': highlighted && !success,
      'border-success text-success pointer-events-none': success,
      'text-black hover:border-black': !success,
    },
  );
  const childClassName = cx(
    'flex flex-col items-center justify-center w-full h-full',
  );

  return (
    <div className='w-[68px] h-[68px] flex flex-col items-center justify-center'>
      <button
        className={containerClassName}
        disabled={disabled || loading}
        onClick={onClick}
        ref={ref as Ref<HTMLButtonElement>}
        type={htmlType}
        {...rest}
      >
        <span className={childClassName}>
          <span className='h-6 w-6 rotate-[-45deg]'>
            {loading ? (
              <Spin
                className='opacity-20'
                size='small'
              />
            ) : (
              <span>{children}</span>
            )}
          </span>
        </span>
      </button>
    </div>
  );
});
