import { ErrorsModel } from "./errors.model";

export interface ResponseModel<T = unknown> {
    status:'success' | 'error' | 'server-error';
    data?:T;
    errors?:ErrorsModel<any>,
    message?:string
}
