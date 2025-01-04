import { ComponentProps, createElement } from 'react';

export const ICON_NAMES = {} as const;

export type IconName = keyof typeof ICON_NAMES;

export interface IconProps
  extends Omit<ComponentProps<'svg'>, 'width' | 'height'> {
  filled?: boolean;
  name: IconName;
  outlined?: boolean;
  size?: string | number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  if (!Object.keys(ICON_NAMES).includes(name)) {
    return null;
  }
  return createElement(ICON_NAMES[name], {
    width: size,
    height: size,
    ...rest,
  });
}

interface CustomSizedIconProps extends ComponentProps<'svg'> {
  name: IconName;
}

export function CustomSizedIcon({ name, ...props }: CustomSizedIconProps) {
  return createElement(ICON_NAMES[name], {
    ...props,
  });
}
