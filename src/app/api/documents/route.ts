import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const where: any = { userId: (session.user as any).id };
  if (status && status !== "ALL") where.status = status;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.document.count({ where }),
  ]);

  return NextResponse.json({ documents, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, templateId } = await req.json();
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;

  const doc = await prisma.document.create({
    data: {
      title: title || "Untitled Document",
      content: content || "",
      userId: (session.user as any).id,
      templateId: templateId || null,
      wordCount,
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
