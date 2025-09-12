import { errorHandler } from "@nextjs-expressjs-postgresql/shared/helpers/error-handler.helper";
import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";
import { getResponseSetCookies } from "../../../lib/api/forward-cookies";
import { cookies } from "next/headers";

export default async function requestHandler(action:(()=>Promise<Response>)){
    try{        
        const res = await action();        
        const setCookies = getResponseSetCookies(res);
        const cookieStore = await cookies();

        for(let setCookie of setCookies){
            cookieStore.set(setCookie);
        }
        
        return await res.json() as ResponseModel                    
    } catch (error) {
        return errorHandler(error);
    }
}