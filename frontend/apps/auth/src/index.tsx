import { ThemeProvider } from 'design-system';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Router from 'routes/Router';
import { setupStore } from 'stores/store';
import './i18n/i18n';
import 'design-system/tailwind.css';
import 'antd/dist/reset.css';
import 'design-system/globals.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={setupStore}>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </Provider>,
);
