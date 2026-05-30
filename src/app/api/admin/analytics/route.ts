import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, totalDocuments, aiCallsToday, aiLogsThisMonth, recentSignups, contentTypes] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.aIUsageLog.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.aIUsageLog.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true, agentUsed: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { createdAt: true },
    }),
    prisma.document.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  // Build daily AI usage for last 7 days
  const dailyAI: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyAI[key] = 0;
  }
  aiLogsThisMonth.forEach((log) => {
    const key = new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (key in dailyAI) dailyAI[key]++;
  });

  // Build signup trend for last 7 days
  const signupTrend: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    signupTrend[key] = 0;
  }
  recentSignups.forEach((u) => {
    const key = new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (key in signupTrend) signupTrend[key]++;
  });

  return NextResponse.json({
    overview: {
      totalUsers,
      totalDocuments,
      aiCallsToday,
      monthlyRevenue: totalUsers * 12, // mock revenue
    },
    dailyAI: Object.entries(dailyAI).map(([date, count]) => ({ date, count })),
    signupTrend: Object.entries(signupTrend).map(([date, count]) => ({ date, count })),
    contentTypes: contentTypes.map((c) => ({ name: c.status, value: c._count })),
  });
}
