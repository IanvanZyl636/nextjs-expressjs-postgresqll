import { AuthProvider } from "src/constants/auth-provider.constants";

export interface CredentialInput {
  email: string;
  password: string;
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
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
  };
}
