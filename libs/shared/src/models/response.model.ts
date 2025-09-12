import { ErrorsModel } from "./errors.model";

export interface ResponseModel<T = undefined> {
    status:'success' | 'error' | 'server-error';
    data?:T;
    errors?:ErrorsModel<any>,
    message?:string
}
