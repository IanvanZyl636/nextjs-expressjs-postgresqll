import {testfunc} from "@nextjs-expressjs-postgresql/shared";
import LoginComponent from "./auth/login/_components/login";

export default function Home() {
  return (
    <div>
        {testfunc()}
        <LoginComponent/>
    </div>
  );
}
