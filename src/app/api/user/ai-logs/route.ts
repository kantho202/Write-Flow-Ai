import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const agent = searchParams.get("agent");
  const limit = 10;

  const where: any = { userId: (session.user as any).id };
  if (agent) where.agentUsed = { contains: agent, mode: "insensitive" };

  const [logs, total] = await Promise.all([
    prisma.aIUsageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.aIUsageLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, pages: Math.ceil(total / limit) });
}
