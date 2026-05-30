import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, tone, audience, contentType } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const systemPrompt = `You are WriteFlow AI, an expert content writer. Generate high-quality, engaging content based on the user's requirements. Always return structured, ready-to-use content.`;

  const userPrompt = `Write a ${contentType || "blog post"} about: "${topic}"
Tone: ${tone || "Professional"}
Target Audience: ${audience || "General audience"}

Please provide:
1. A compelling title
2. A meta description (max 160 chars)
3. The full content with proper headings and structure
4. 3-5 relevant tags

Format your response as JSON with keys: title, metaDescription, content, tags`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Log AI usage
    await prisma.aIUsageLog.create({
      data: {
        userId: (session.user as any).id,
        agentUsed: "Content Draft Agent",
        promptSnippet: topic.substring(0, 100),
        tokensUsed,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI draft error:", error);
    return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 });
  }
}
