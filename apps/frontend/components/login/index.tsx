'use client'

import { CredentialInputModel, CredentialInputSchema } from "@nextjs-expressjs-postgresql/shared/zod/Auth.schema";
import ValidationForm, { ValidationFormControlProps } from "../validation-form/validation-form";
import { LoginAction } from "@/app/actions/auth.action";
import {useEffect, useState} from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { siteConfig } from "@/global/siteConfig";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";  


function LoginFormControls({
                                 values,
                                 errors,
                                 touched,
                                 state,
                                 handleAction,
                                 handleChange,
                                 handleBlur,
                                 resetForm
                             }: ValidationFormControlProps<CredentialInputModel>) {    
    const [loading, setLoading] = useState<boolean>(false);    

    useEffect(() => {
        if (state.status === 'success'){
            toast({
                variant: "success",
                title: "Successfully submitted!",
                duration:3000
            });            
        }

        if (state.status === 'server-error'){
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: <div><br/>There was a problem with your request.<br/>Please try again later or contact <a href={`tel:${siteConfig.phoneNumber}`}><b>{siteConfig.displayPhoneNumber}</b></a></div>,
                duration:6000
            });           
        }

        setLoading(false);
    }, [state, toast]);

    return (
        <>        
            <form action={handleAction} onReset={resetForm}>
                <div className="flex flex-col gap-4">                    
                    <div>
                        <Input
                            type={'email'}
                            name={'email'}
                            id={'email'}
                            placeholder={'Email'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            error={touched.email && !!errors.email}
                        />
                        {
                            (touched.email && !!errors.email) ?
                                <span className={'text-destructive text-sm'}>{errors.email}</span> : <></>
                        }
                    </div>
                    <div>
                        <Input
                            type={'text'}
                            name={'password'}
                            id={'password'}
                            placeholder={'Password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            error={touched.password && !!errors.password}
                        />
                        {
                            (touched.password && !!errors.password) ?
                                <span
                                    className={'text-destructive text-sm'}>{errors.password}</span> : <></>
                        }
                    </div>
                                     

                        <Button className={loading?'visible':'hidden'} disabled>
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                        <Button className={!loading?'visible':'hidden'} type={'submit'} onClick={() => setLoading(true)}>Login</Button>

                </div>
            </form>            
        </>
    )
}

export default function LoginComponent() {

  return (    
    <div className="flex flex-row justify-center">
        <div className="w-lg">
      <ValidationForm
        initialValue={{
          email: "",
          password: "",
        }}
        zodResolver={CredentialInputSchema}
        action={LoginAction}
      >
        {(props) => {
          return <LoginFormControls {...props} />;
        }}
      </ValidationForm>
      </div>
    </div>
  );
}