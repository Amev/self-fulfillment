import { Middleware } from '@reduxjs/toolkit';
import { postSignOut } from './auth/authClient';
import type { RootState } from './store';

interface AuthErrorAction {
  type: string;
  error?: {
    code: string;
  };
}

const isTypedAction = (action: unknown): action is AuthErrorAction => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string'
  );
};

const authMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
  if (isTypedAction(action)) {
    if (
      action.type !== 'user/logout/rejected' &&
      action.type !== 'user/expireSession/rejected' &&
      action.error?.code === '403'
    ) {
      postSignOut();
    }
  }
  return next(action);
};

export default authMiddleware;
