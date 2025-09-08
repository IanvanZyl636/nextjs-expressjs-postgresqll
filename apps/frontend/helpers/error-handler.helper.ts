import { ResponseModel } from "@nextjs-expressjs-postgresql/shared";
import { formatZodIssues } from "./formet-zod-issues.helper";
import { ZodError } from "zod";

export function errorHandler(error: unknown) {
    if (error instanceof ZodError) {
        const actionErrorResponse: ResponseModel = {
            status: "error",
            errors: formatZodIssues(error.issues),
        };

        return actionErrorResponse;
    }

    if (error instanceof Error) {
        const actionErrorResponse: ResponseModel = {
            status: "server-error",
            message: error.message,
        };

        return actionErrorResponse;
    }

    return {
        status: "server-error",
        message: "An unknown error occurred.",
    } as ResponseModel;
}