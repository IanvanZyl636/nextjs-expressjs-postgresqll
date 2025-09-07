import { z } from "zod";
import { AuthProvider } from "../constants/auth-provider.constants";

// CredentialInput schema (only require email + password)
export const CredentialInputSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),  
});

// GoogleInput schema
export const GoogleInputSchema = z.object({
  token: z.string().min(1, "Google token is required"),
});

// MagicLinkInput schema
export const MagicLinkInputSchema = z.object({
  token: z.string().min(1, "Magic link token is required"),
});

// ProviderInput schema (discriminated union)
export const ProviderInputSchema = z.discriminatedUnion("provider", [
  z.object({
    provider: z.literal(AuthProvider.CREDENTIALS),
    data: CredentialInputSchema,
  }),
  z.object({
    provider: z.literal(AuthProvider.GOOGLE),
    data: GoogleInputSchema,
  }),
  z.object({
    provider: z.literal(AuthProvider.MAGIC_LINK),
    data: MagicLinkInputSchema,
  }),
]);

// Inferred types if you want to use them with TypeScript
export type CredentialInputModel = z.infer<typeof CredentialInputSchema>;
export type ProviderInputModel = z.infer<typeof ProviderInputSchema>;