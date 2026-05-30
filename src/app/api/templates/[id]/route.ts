import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true, documents: true } },
    },
  });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const avgRating = template.reviews.length
    ? template.reviews.reduce((sum, r) => sum + r.rating, 0) / template.reviews.length
    : null;

  return NextResponse.json({ ...template, avgRating });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const template = await prisma.template.update({ where: { id }, data });
  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
