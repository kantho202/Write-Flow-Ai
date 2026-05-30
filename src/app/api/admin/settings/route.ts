import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.siteSettings.findFirst({ where: { id: "default" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  return NextResponse.json(settings);
}
