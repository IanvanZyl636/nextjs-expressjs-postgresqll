import { COOKIES } from "@nextjs-expressjs-postgresql/shared/constants/cookies.constants";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@nextjs-expressjs-postgresql/shared/models/jwt-payload.model';
import { getResponseSetCookies } from "@/lib/api/forward-cookies";
import { serverApiFetch } from "./api/server-api-client";
import { NextRequest, NextResponse } from "next/server";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true;

  try {
    jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload & jwt.JwtPayload;
    return false;
  } 
  catch (e) {    
    return true;
  }
}

async function refreshJwt(refreshToken: string) {
  const res = await serverApiFetch("/api/auth/refresh", {
    forwardClientHeaders: true,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-cache'
  });

  return res;
}

export async function updateSession(req: NextRequest):Promise<{
  statusCode: number
  response:NextResponse<unknown>
}> {
  try {
    const accessToken = req.cookies.get(COOKIES.accessToken)?.value;
    const refreshToken = req.cookies.get(COOKIES.refreshToken)?.value;

    if (!refreshToken) return {statusCode: 401, response: NextResponse.next()};

    const nextRes = NextResponse.next();
    const cookieStore = await cookies();

    if (isJwtExpired(accessToken)) {
      const res = await refreshJwt(refreshToken);

      if (!res.ok) return {statusCode: 401, response: NextResponse.next()};

      const setCookies = getResponseSetCookies(res);

      for (let setCookie of setCookies) {
        nextRes.cookies.set(setCookie);
        cookieStore.set(setCookie);
      }
    }

    return {statusCode: 200, response: nextRes};
  } catch (e) {    
    return {statusCode: 503, response: NextResponse.next()};
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get(COOKIES.accessToken)?.value;
    const refreshToken = cookieStore.get(COOKIES.refreshToken)?.value;

    if (!accessToken) return;

    if (isJwtExpired(accessToken)) return;

    return { ...jwt.verify(accessToken, JWT_ACCESS_SECRET) as jwt.JwtPayload & JwtPayload, accessToken, refreshToken }
  } catch {
    return undefined;
  }
}