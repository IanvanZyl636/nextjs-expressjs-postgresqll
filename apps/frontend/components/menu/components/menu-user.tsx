import { getSession } from "@/lib/auth";
import { SetClientSession } from "@/providers/session-provider";

export async function MenuUser(){    
    const session = await getSession();
     
    return (<>
        Session: {session?.userId}
        <SetClientSession session={session}></SetClientSession>
    </>)
}