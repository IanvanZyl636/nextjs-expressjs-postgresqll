import { errorHandler } from "@nextjs-expressjs-postgresql/shared/helpers/error-handler.helper";
import { getResponseSetCookies } from "../../../lib/api/forward-cookies";
import { cookies } from "next/headers";
import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";

export default async function requestHandler(action:(()=>Promise<Response>)):Promise<ResponseModel>{
    try{        
        const res = await action();   
        
        if(!res.ok){
            switch (res.status) {
                case 401:
                    return {status:'error', message:'Invalid email or password'}                                
                default:
                    return {status:'server-error'}                
            }
        }
        
        const setCookies = getResponseSetCookies(res);
        const cookieStore = await cookies();

        for(let setCookie of setCookies){
            cookieStore.set(setCookie);
        }
        
        return await res.json()                    
    } catch (error) {
        return errorHandler(error);
    }
}