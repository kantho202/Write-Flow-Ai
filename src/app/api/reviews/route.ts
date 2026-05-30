import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        template: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count(),
  ]);

  return NextResponse.json({ reviews, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { templateId, rating, content } = await req.json();
  if (!templateId || !rating || !content) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      templateId,
      rating: Math.min(5, Math.max(1, rating)),
      content,
      userId: (session.user as any).id,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
