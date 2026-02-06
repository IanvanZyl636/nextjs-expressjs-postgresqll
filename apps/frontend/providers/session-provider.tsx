"use client";
import { ClientSession } from "@/models/client-session.model";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

enum AuthStatus{
  Unknown = "unknown",
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated"
}

const SessionContext = createContext<{
  session?: ClientSession; 
  authStatus: AuthStatus;
  setSession: Dispatch<SetStateAction<ClientSession | undefined>>;
  fetchSession: () => Promise<void>;
}>({
  session: undefined,
  authStatus: AuthStatus.Unknown,
  setSession: () => {return undefined},
  fetchSession: async () => {},
});

export function SessionProvider({session:initialSession, children }: { session?: ClientSession, children: React.ReactNode }) {
  const [session, setSession] = useState<ClientSession | undefined>(initialSession);   
  const [authStatus, setAuthStatus] = useState<AuthStatus>(() => {
    if (initialSession) return AuthStatus.Authenticated;
    return AuthStatus.Unknown;
  }); 

  async function fetchSession() {   
    try {
      const res = await fetch("/api/auth/session");

      if (res.status === 401) {    
        setSession(undefined);
        setAuthStatus(AuthStatus.Unauthenticated);
        return;
      }

      if (!res.ok) {      
        setSession(undefined);
        setAuthStatus(AuthStatus.Unknown);
        return;
      }

      setSession(await res.json());
      setAuthStatus(AuthStatus.Authenticated);
    } catch {  
      setSession(undefined);
      setAuthStatus(AuthStatus.Unknown);
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])
  

 useEffect(() => {
    const onFocus = () => {
      if (authStatus === AuthStatus.Unauthenticated) return;
      fetchSession();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authStatus]);

  return (
    <SessionContext.Provider value={{ session, authStatus, setSession, fetchSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function SetClientSession({session}:{session?: ClientSession}){
  const clientSession = useSession();

  useEffect(()=>{
    clientSession.setSession(session);
  }, [session])
  
  return <></>;
}
