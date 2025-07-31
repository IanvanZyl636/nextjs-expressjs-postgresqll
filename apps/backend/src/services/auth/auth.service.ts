import HttpError from "../../utils/error/http-error";
import {AuthProvider, AuthResult, ProviderInput, RegisterResult} from '@nextjs-expressjs-postgresql/shared'
import { loginWithCredentials, registerCredentials } from "./providers/credential-auth.service";

export async function register(input: ProviderInput): Promise<RegisterResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return registerCredentials(input.data);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported register provider')      
  }
};

export async function login(input: ProviderInput): Promise<AuthResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return loginWithCredentials(input.data);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported login provider')      
  }
};