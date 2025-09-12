import { getSession, updateSession } from '@/lib/auth';
import { NextRequest } from 'next/server';

const API_URL = process.env.API_URL!;

const proxy = async (request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) => {                      
    const path = `/api/${(await params).slug.join('/')}`;
    const proxyURL = new URL(path, API_URL);
    const proxyRequest = new NextRequest(proxyURL, request);  
    await updateSession(proxyRequest);    
    const session = await getSession();

    if (session?.accessToken) proxyRequest.headers.set("Authorization", `Bearer ${session.accessToken}`);  

    try {
        return fetch(proxyRequest);
    } catch (reason) {
        const message = reason instanceof Error ? reason.message : 'Unexpected exception'

        return new Response(message, { status: 500 })
    }
}

export async function GET(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {       
    return proxy(request, params);    
}

export async function HEAD(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}

export async function POST(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}

export async function PUT(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}

export async function DELETE(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}

export async function PATCH(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
export async function OPTIONS(request: NextRequest, params: { params: Promise<{ slug: string[] }> }) {    
    return proxy(request, params);
}