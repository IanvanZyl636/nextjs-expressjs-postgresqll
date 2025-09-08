import { errorHandler } from "@nextjs-expressjs-postgresql/shared/helpers/error-handler.helper";
import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";


export default async function requestHandler(action:(()=>Promise<void>) | (()=> void)){
    try{
        await action();

        return {status:'success'} as ResponseModel;
    } catch (error) {
        return errorHandler(error);
    }
}