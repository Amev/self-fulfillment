import cx from 'classnames';
import { PropsWithChildren, ReactNode } from 'react';

export interface SpinProps {
  className?: string;
  color?: 'black' | 'white';
  spinning?: boolean;
  size?: 'small' | 'medium' | 'large';
  tip?: ReactNode;
}

const SIZES = {
  small: 'border-2 size-4 after:border-2 after:size-4',
  medium: 'border-2 size-6 after:border-2 after:size-6',
  large: 'border-4 size-12 after:border-4 after:size-12',
};

const COLORS = {
  black: 'border-black',
  white: 'border-white',
};

export function Spin({
  children = false,
  className = '',
  color = 'black',
  spinning = undefined,
  size = 'medium',
  tip = false,
}: PropsWithChildren<SpinProps>) {
  if (children && spinning === false) {
    return children;
  }

  if (spinning === false) {
    return false;
  }

  if (spinning && tip) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <span
          className={cx(
            'custom-spinner',
            COLORS[color],
            SIZES[size],
            className,
          )}
        />
        <span>{tip}</span>
      </div>
    );
  }

  return (
    <span
      className={cx('custom-spinner', COLORS[color], SIZES[size], className)}
    />
  );
}
