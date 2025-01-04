import { ConfigProvider, ThemeConfig } from 'antd';
import deepmerge from 'deepmerge';
import { PropsWithChildren, useMemo } from 'react';

const THEME = {
  token: {
    fontFamily: 'Montserrat',
    fontSize: 16,
  },
  components: {
    Typography: {
      titleMarginTop: '0px',
      titleMarginBottom: '0px',
    },
    Button: {
      fontWeight: 500,
    },
  },
};

interface ThemeProviderProps {
  override?: ThemeConfig;
}

export function ThemeProvider({
  children = null,
  override = {},
}: PropsWithChildren<ThemeProviderProps>) {
  const theme = useMemo(() => deepmerge(THEME, override), [override]);

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
