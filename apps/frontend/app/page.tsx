import LoginComponent from "@/components/login";
import { SonnerDemo } from "@/components/sonner-demo";
import { apiFetch } from "@/lib/api";

export default async function Home() {
  const health = await apiFetch<any>("/api/health");

  return (
    <div>   
      <h1 className="text-3xl font-bold underline">Health: {health.OK}</h1>     
        <LoginComponent/>
        <SonnerDemo/>
    </div>
  );
}
