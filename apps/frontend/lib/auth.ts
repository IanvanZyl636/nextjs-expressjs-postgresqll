import { COOKIES } from "@nextjs-expressjs-postgresql/shared/constants/cookies.constants";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import {JwtPayload} from '@nextjs-expressjs-postgresql/shared/models/jwt-payload.model';
import { getResponseSetCookies } from "@/lib/api/forward-cookies";
import { serverApiFetch } from "./api/server-api-client";
import { NextRequest, NextResponse } from "next/server";

function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true;

  const tokenValue = jwt.decode(token) as JwtPayload & jwt.JwtPayload;

  if (!tokenValue.exp) return true;

  const now = Math.floor(Date.now() / 1000);

  return tokenValue.exp < now;
}

async function refreshJwt(refreshToken: string){
    const res = await serverApiFetch("/api/auth/refresh", {
      forwardClientHeaders:true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify({refreshToken}),
      cache:'no-cache'
    });      

    return res;
}

export async function updateSession(req: NextRequest){    
    const accessToken = req.cookies.get(COOKIES.accessToken)?.value;
    const refreshToken = req.cookies.get(COOKIES.refreshToken)?.value;

    if(!refreshToken) return;    

    const nextRes = NextResponse.next();
    const cookieStore = await cookies();

    if(isJwtExpired(accessToken)){
        const res = await refreshJwt(refreshToken);

        if(!res.ok) return;  
        
        const setCookies = getResponseSetCookies(res);

        for(let setCookie of setCookies)
        {
            nextRes.cookies.set(setCookie);
            cookieStore.set(setCookie);
        }        
    }

    return nextRes;
}

export async function getSession(){    
    const cookieStore = await cookies();
    
    const accessToken = cookieStore.get(COOKIES.accessToken)?.value;
    const refreshToken = cookieStore.get(COOKIES.refreshToken)?.value;

    if(!accessToken) return;    

    if(isJwtExpired(accessToken)) return;

    return {...jwt.decode(accessToken) as jwt.JwtPayload & JwtPayload, accessToken, refreshToken}
}