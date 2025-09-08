import { ErrorsModel } from "@nextjs-expressjs-postgresql/shared";
import { ZodIssue } from "zod";

export function formatZodIssues<T>(issues: ZodIssue[]){
    let errors:ErrorsModel<T> = {} as { [K in keyof T]: string };
    issues.forEach((issue) => {
        const key = issue.path.join('.');
        if(!errors.hasOwnProperty(key)){
            errors = {...errors, [key]:issue.message}
        }
    })

    return errors;
}