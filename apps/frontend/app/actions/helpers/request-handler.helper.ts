import { errorHandler, ResponseModel } from "@nextjs-expressjs-postgresql/shared";



export default async function requestHandler(action:(()=>Promise<void>) | (()=> void)){
    try{
        await action();

        return {status:'success'} as ResponseModel;
    } catch (error) {
        return errorHandler(error);
    }
}