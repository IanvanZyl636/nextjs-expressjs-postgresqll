'use client'
import { useSession } from "@/providers/session-provider";

export function MenuUser(){    
    const {session} = useSession();
     
    return (<>
        Session: {session?.userId}        
    </>)
}