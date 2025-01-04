import { Roles } from './status';

export interface Paginator {
  count: number;
  pageSize: number;
  current: number;
}

export interface PaginateData<T> {
  paginator: Paginator;
  data: T[];
}

export interface PaginateCursor {
  page: number;
  pageSize: number;
  query?: string;
}

export function emptyPaginateData() {
  return {
    data: [],
    paginator: {
      count: 0,
      pageSize: 1,
      current: 1,
    },
  };
}

export interface User {
  id: string;
  email: string;
  account_status: AccountStatus;
  firstName: string;
  lastName: string;
  birth_date: string;
  gender: string;
  phone: string;
  date_joined: string;
  last_login: string;
  phone_validated?: boolean;
  groups: Roles[];
  avatar: string;
  mfa: boolean;
}

export const ACCOUNT_STATUS = {
  COGNITO: 'Cognito',
  GOOGLE: 'Google',
  OTHER: 'Other',
} as const;

type AccountStatusKeys = keyof typeof ACCOUNT_STATUS;
export type AccountStatus = (typeof ACCOUNT_STATUS)[AccountStatusKeys];

export const PERMISSIONS = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

type PermissionKeys = keyof typeof PERMISSIONS;
export type Permission = (typeof PERMISSIONS)[PermissionKeys];

export const CENTER_MEDIA_TYPES = {
  splash: 'splash',
} as const;

type CenterMediaTypesKeys = keyof typeof CENTER_MEDIA_TYPES;
export type CenterMediaTypes =
  (typeof CENTER_MEDIA_TYPES)[CenterMediaTypesKeys];

export interface Meta {
  text: string;
  icon: string;
}
export interface Information {
  question: string;
  answer: string;
  logo: string;
}
export interface Carousel {
  id: string;
  url: string;
}
export interface About {
  title: string;
  content: string;
}
export interface Review {
  author: string;
  place: string;
  content: string;
}
export interface FAQ {
  question: string;
  answer: string;
}
export interface Activity {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  bondsports_url: string;
  center_id: string;
  created: string;
  updated: string;
  type: string;
  carousel: Carousel[];
  price: Record<string, string>;
  meta: Record<string, Meta>[];
  informations: Record<string, Information>[];
  about: Record<string, About>[];
  reviews: Record<string, Review>[];
  faq: Record<string, FAQ>[];
}

export interface Center {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: Record<string, string>;
  address: string;
  activities: Activity[];
  medias: Record<CenterMediaTypes, string>;
  city: string;
  country: string;
  phone: string;
  services: string[];
}

export interface linkCenter {
  id: string;
  centerID: string;
  bondsports_url: string;
}

export interface Publish {
  id: string;
  created: string;
  updated: string;
  published: boolean;
}

export const COUNTRIES = {
  US: 'us',
  CA: 'ca',
} as const;

type CountryKeys = keyof typeof COUNTRIES;
export type Country = (typeof COUNTRIES)[CountryKeys];

export const Services = ['bar', 'lounge', 'private_event', 'coffee'];

export const LANGUAGES = {
  EN: 'en',
  FR: 'fr',
} as const;

type LanguageKeys = keyof typeof LANGUAGES;
export type Language = (typeof LANGUAGES)[LanguageKeys];

export interface Article {
  id: string;
  language: Language;
  title: string;
  created: string;
  updated: string;
  content: string;
}

export interface ActivityType {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image: string;
}

export const SITES = {
  Facebook: 'https://*.facebook.com/',
  Youtube: 'https://*.youtube.com/',
} as const;

export type Site = keyof typeof SITES;
