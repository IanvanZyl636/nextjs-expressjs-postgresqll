import LoginComponent from "@/components/login";
import { SonnerDemo } from "@/components/sonner-demo";
import { serverApiFetch } from "@/lib/api/server-api-client";
import { TestButton } from "./test";

export default async function Home() {   
  const user = await (await serverApiFetch("/api/protected/user", {forwardClientHeaders:true})).json();  

  return (
    <div>   
      <h1 className="text-3xl font-bold underline">Health: {user.status}</h1>     
        <LoginComponent/>     
        <TestButton />
        <SonnerDemo/>
    </div>
  );
}


