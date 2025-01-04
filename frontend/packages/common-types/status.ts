export const REQUEST_STATUSES = {
  CANCEL: 'CANCEL',
  ERROR: 'ERROR',
  NOT_INITIALIZED: undefined,
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
} as const;

type RequestStatusKeys = keyof typeof REQUEST_STATUSES;
export type RequestStatus = (typeof REQUEST_STATUSES)[RequestStatusKeys];

export const AUTH_STATUSES = {
  LOGGED: 'LOGGED',
  LOGGED_OUT: 'LOGGED_OUT',
  NOT_CHECKED: 'NOT_CHECKED',
  NOT_LOGGED: 'NOT_LOGGED',
} as const;

type AuthStatusKeys = keyof typeof AUTH_STATUSES;
export type AuthStatus = (typeof AUTH_STATUSES)[AuthStatusKeys];

export const ROLES = {
  ACTIVE: 'active',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

type RolesKeys = keyof typeof ROLES;
export type Roles = (typeof ROLES)[RolesKeys];
