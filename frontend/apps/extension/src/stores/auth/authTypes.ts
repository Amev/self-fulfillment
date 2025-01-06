export interface Credentials {
  email: string;
  password: string;
}

export interface ConfirmCredentials extends Credentials {
  otp: string;
}

export interface MfaCredentials {
  csrf: string;
  phone: string;
}

export interface ConfirmMfaCredentials {
  csrf: string;
  otp: string;
}

export interface SignInResponse {
  code?: string;
  mfa?: boolean;
  phone?: string;
  csrf?: string;
}

export interface SignInResponseCode {
  code: string;
}

export interface SignInResult {
  code?: string;
  mfaCredentials?: MfaCredentials;
  credentials?: Credentials;
}

export interface ProviderCredentials {
  provider: string;
  clientId: string;
  code: string;
}

export interface SignUpResendCode {
  email: string;
}
