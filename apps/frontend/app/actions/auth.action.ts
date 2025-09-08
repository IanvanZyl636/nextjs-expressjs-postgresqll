'use server'

import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";
import requestHandler from "./helpers/request-handler.helper";
import { CredentialInputSchema } from "@nextjs-expressjs-postgresql/shared/zod/Auth.schema";
import { apiFetch } from "@/lib/api";
import { AuthResult } from "@nextjs-expressjs-postgresql/shared/types/auth-provider.types";

export async function LoginAction(prevState: ResponseModel, formData: FormData){
    return requestHandler(async () => {
        const loginFormData = Object.fromEntries(formData);

        const loginModel = CredentialInputSchema.parse(loginFormData);

        const res = await apiFetch<AuthResult>("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginModel),
          });                  
                  
          return res;
    });
}