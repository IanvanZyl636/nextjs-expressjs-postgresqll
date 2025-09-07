export type ErrorsModel<T> = {
    [K in keyof T]: string;
};