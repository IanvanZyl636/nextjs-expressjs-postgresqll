import { getSession, updateSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await updateSession(request);
    const session = await getSession();

    if (!session) {
        return new NextResponse(null, { status: 401 })
    }

    return NextResponse.json({ userId: session.user.userId, role: session.user.role });
}