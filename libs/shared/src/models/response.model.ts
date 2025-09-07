import { ErrorsModel } from "./errors.model";

export interface ResponseModel {
    status:'success' | 'error' | 'server-error';
    errors?:ErrorsModel<any>,
    message?:string
}
