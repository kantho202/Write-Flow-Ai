import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    include: { user: { select: { name: true } }, template: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (!reviews.length) {
    return NextResponse.json({ error: "No reviews to summarise" }, { status: 400 });
  }

  const reviewText = reviews.map((r) =>
    `Template: ${r.template.title} | Rating: ${r.rating}/5 | Review: ${r.content}`
  ).join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an analytics assistant. Summarise user reviews and detect overall sentiment.",
        },
        {
          role: "user",
          content: `Analyse these ${reviews.length} reviews and provide:
1. A 3-bullet summary of key themes
2. Overall sentiment (Positive/Neutral/Negative) with percentage breakdown
3. Top praised features
4. Main areas for improvement

Reviews:
${reviewText}

Return as JSON with keys: bullets (array of 3 strings), sentiment (object with positive/neutral/negative percentages), praised (array), improvements (array)`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Summarisation failed" }, { status: 500 });
  }
}
