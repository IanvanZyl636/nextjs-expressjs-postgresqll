import 'server-only';
import { getSession } from '../auth';
import { headers } from "next/headers";

const API_URL = process.env.API_URL!;

interface ServerApiOpts extends RequestInit {
  forwardClientHeaders?: boolean
}

export async function serverApiFetch(path: string, opts: ServerApiOpts = {}) {
  const { forwardClientHeaders: forwardClientHeaders = false, cache = "default", headers: initHeaders, ...rest } = opts;
  const url = `${API_URL}${path}`;

  const proxyReqHeaders = new Headers({ ...initHeaders });
  if (forwardClientHeaders) {
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get("user-agent") || "unknown";
    const ip = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "unknown";

    proxyReqHeaders.set("User-Agent", userAgent);
    proxyReqHeaders.set("X-Forwarded-For", ip);

    const session = await getSession();

    if (session?.accessToken) proxyReqHeaders.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return fetch(url, {
    ...rest,
    headers: proxyReqHeaders,
    cache,
    credentials: "include"
  });
}