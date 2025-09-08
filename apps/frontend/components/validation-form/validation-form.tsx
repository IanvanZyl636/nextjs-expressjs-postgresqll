'use client'
import {ChangeEvent, FocusEvent, ReactNode, useActionState, useCallback, useEffect, useState} from "react";
import {z, ZodRawShape} from "zod";
import {ErrorsModel, ResponseModel} from '@nextjs-expressjs-postgresql/shared';
import { formatZodIssues } from "@/helpers/formet-zod-issues.helper";
import { errorHandler } from "@/helpers/error-handler.helper";

export type TouchedModel<T> = {
    [K in keyof T]: boolean;
};

export interface ValidationFormControlProps<T> {
    values: T,
    errors: ErrorsModel<T>,
    touched: TouchedModel<T>,
    state: ResponseModel,
    handleAction: (payload: FormData) => void,
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    resetForm: () => void
}

export default function ValidationForm<T extends object, Z extends ZodRawShape>(
    {
        initialValue,
        children,
        zodResolver,
        action,
    }:
        {
            initialValue: T,
            children: ({
                           values,
                           errors,
                           touched,
                           state,
                           handleAction,
                           handleChange,
                           handleBlur,
                           resetForm
                       }: ValidationFormControlProps<T>) => ReactNode,
            zodResolver: z.ZodObject<Z>,
            action: ((prevState: ResponseModel, formData: FormData) => Promise<ResponseModel>),
        }
) {
    const resetForm = useCallback(() => {
            setValues(initialValue);
            setTouched({} as TouchedModel<T>);
        }
        , [initialValue]);
    const markAllTouched = () => {
        const obj: { [K in keyof T]: boolean } = {} as { [K in keyof T]: boolean };
        Object.keys(initialValue).forEach(key =>
            obj[key as keyof T] = true
        );

        setTouched(obj);
    }
    const formAction = async (prevState: ResponseModel, formData: FormData) => {
        markAllTouched();

        const parseResult = zodResolver.safeParse(values);

        if (!parseResult.success) {
            const errors = formatZodIssues<T>(parseResult.error.issues);
            setErrors(errors);
            return errorHandler(parseResult.error);
        }

        return await action(prevState, formData);
    }
    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()

        const controlName = e.target.name;

        setTouched({...touched, [controlName]: true});
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();

        const controlName = e.target.name;
        setValues({...values, [controlName]: e.target.value});
    }

    const [values, setValues] = useState(initialValue);
    const [errors, setErrors] = useState<ErrorsModel<T>>({} as ErrorsModel<T>);
    const [touched, setTouched] = useState<TouchedModel<T>>({} as TouchedModel<T>);
    const [state, handleAction] = useActionState(formAction, {} as ResponseModel);

    useEffect(() => {
        const parseResult = zodResolver.safeParse(values);

        let errors: ErrorsModel<T> = {} as { [K in keyof T]: string };

        if (!parseResult.success) {
            const issues = parseResult.error.issues;
            errors = formatZodIssues(issues)
        }

        setErrors(errors);
    }, [values, zodResolver]);

    useEffect(() => {
        if (state.status === 'success') resetForm();
    }, [state, resetForm]);

    return <>
        {
            children({
                values,
                errors,
                touched,
                state,
                handleAction,
                handleChange,
                handleBlur,
                resetForm
            })}
    </>
}
