import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import cx from 'classnames';

const { Text, Title } = Typography;

export { Text, Title };

export function TextLink({
  children,
  className,
  ...props
}: Omit<TextProps, 'underline' | 'color' | 'strong'>) {
  return (
    <Text
      className={cx('text-primary', className)}
      underline
      strong
      {...props}
    >
      {children}
    </Text>
  );
}
