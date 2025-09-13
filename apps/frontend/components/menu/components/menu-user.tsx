import { getSession } from "@/lib/auth";

export async function MenuUser(){    
    const session = await getSession();
     
    return (<>
        Session: {session?.userId}
    </>)
}