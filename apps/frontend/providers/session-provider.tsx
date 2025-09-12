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

const SessionContext = createContext<{
  session?: ClientSession;
  setSession: Dispatch<SetStateAction<ClientSession | undefined>>;
  fetchSession: () => Promise<void>;
}>({
  session: undefined,
  setSession: () => {
    return undefined;
  },
  fetchSession: async () => {},
});

export function SessionProvider({
  session: initialSession,
  children,
}: {
  session: ClientSession | undefined;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<ClientSession | undefined>(
    initialSession
  );

  async function fetchSession() {
    const res = await fetch("/api/auth/session");

    if (!res.ok) return;

    const data = await res.json();

    setSession(data);
  }

  useEffect(() => {    
    const onFocus = () => fetchSession();
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, setSession, fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
