'use server'

import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";
import requestHandler from "./helpers/request-handler.helper";
import { CredentialInputSchema } from "@nextjs-expressjs-postgresql/shared/zod/Auth.schema";
import { serverApiFetch } from "@/lib/api/server-api-client";

export async function LoginAction(prevState: ResponseModel, formData: FormData) {
  return requestHandler(async () => {
    const loginFormData = Object.fromEntries(formData);

    const loginModel = CredentialInputSchema.parse(loginFormData);    

    const res = await serverApiFetch("/api/auth/login", {
      method: "POST",
      headers: {        
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginModel),
      cache: 'no-cache'
    });

    return res;
  });
}