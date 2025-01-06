interface ImportMetaEnv {
  readonly VITE_ROOT_API_URL: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_SIGN_IN_URL: string;
  readonly VITE_SHOWCASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
