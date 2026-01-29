import { PaymentProvider } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';
import * as payfast from './payfast.provider';

export function getProvider(provider: PaymentProvider) {
  switch (provider) {
    case PaymentProvider.PAYFAST:
      return payfast;
    default:
      return null;
  }
}
