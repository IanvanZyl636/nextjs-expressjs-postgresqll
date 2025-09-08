'use server'

// import { CredentialInputSchema, ResponseModel } from "@nextjs-expressjs-postgresql/shared";
// import requestHandler from "./helpers/request-handler.helper";

// export async function LoginAction(prevState: ResponseModel, formData: FormData){
//     return requestHandler(async () => {
//         const loginFormData = Object.fromEntries(formData);

//         const loginModel = CredentialInputSchema.parse(loginFormData);

//         const res = await fetch("http://localhost:3000/api/login", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(loginModel),
//           });
        
//           if (!res.ok) {
//             throw new Error("Login failed");
//           }
        
//           const data = await res.json();
//           return data;
//     });
// }

export async function LoginAction(prevState: any, formData: FormData):Promise<any>{
    return {status:'success'}
}