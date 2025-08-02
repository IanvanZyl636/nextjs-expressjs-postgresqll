import { AuthProvider } from "../constants/auth-provider.constants";

export interface CredentialInput {
  email: string;
  password: string;
  ip?:string;
  userAgent?:string;
}

export interface GoogleInput {
  token: string;
}

export interface MagicLinkInput {
  token: string;
}

export type ProviderInput =
  | { provider: AuthProvider.CREDENTIALS; data: CredentialInput }
  | { provider: AuthProvider.GOOGLE; data: GoogleInput }
  | { provider: AuthProvider.MAGIC_LINK; data: MagicLinkInput };

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
