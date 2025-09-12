import { AUTH_PROVIDER } from "../constants/auth-provider.constants";

export interface CredentialInput {
  email: string;
  password: string;
  ip:string;
  userAgent:string;
}

export interface GoogleInput {
  token: string;
}

export interface MagicLinkInput {
  token: string;
}

export type ProviderInput =
  | { provider: AUTH_PROVIDER.CREDENTIALS; data: CredentialInput }
  | { provider: AUTH_PROVIDER.GOOGLE; data: GoogleInput }
  | { provider: AUTH_PROVIDER.MAGIC_LINK; data: MagicLinkInput };

export interface RegisterResult {
    email:string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {    
    email: string;
  };
}
