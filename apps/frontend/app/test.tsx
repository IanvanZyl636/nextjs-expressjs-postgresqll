'use client'

import { useSession } from "@/providers/session-provider";
import { Role } from "@nextjs-expressjs-postgresql/shared/prisma/enhance/enums";
import { useState } from "react";

export function TestButton(){
    const [test, setTest] = useState<string>('');
    const {session} = useSession();    

    const clickfunc = async () => {
        const resp = await fetch('/api/protected/user');
        setTest((await resp.json())?.status ?? '')
    }

    return (<>

        {session?.userId}
        {test}
        <div onClick={clickfunc}>CLICK</div>
        <div onClick={ () => {console.log(session)}}>Manual change session</div>
    </>)
}