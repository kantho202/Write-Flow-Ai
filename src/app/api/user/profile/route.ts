import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [user, docsThisMonth, totalWords] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, bio: true, plan: true, role: true, createdAt: true },
    }),
    prisma.document.count({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.document.aggregate({ where: { userId }, _sum: { wordCount: true } }),
  ]);

  return NextResponse.json({
    ...user,
    stats: {
      docsThisMonth,
      totalWords: totalWords._sum.wordCount || 0,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, bio, image } = await req.json();
  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name, bio, image },
    select: { id: true, name: true, email: true, image: true, bio: true },
  });
  return NextResponse.json(user);
}
