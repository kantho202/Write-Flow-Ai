import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "popular";
  const rating = searchParams.get("rating");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: any = { published: true };
  if (category && category !== "ALL") where.category = category;
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
  ];

  let orderBy: any = { usageCount: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };
  if (sort === "rating") orderBy = { reviews: { _count: "desc" } };

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.template.count({ where }),
  ]);

  const templatesWithRating = templates.map((t) => ({
    ...t,
    avgRating: t.reviews.length
      ? (t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length).toFixed(1)
      : null,
    reviewCount: t._count.reviews,
  }));

  // Filter by rating if specified
  const filtered = rating
    ? templatesWithRating.filter((t) => t.avgRating && parseFloat(t.avgRating) >= parseFloat(rating))
    : templatesWithRating;

  return NextResponse.json({ templates: filtered, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const template = await prisma.template.create({ data });
  return NextResponse.json(template, { status: 201 });
}
