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

  const { text, tone, action } = await req.json();
  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  let instruction = "";
  switch (action) {
    case "shorten": instruction = "Shorten this text while keeping the key message."; break;
    case "expand": instruction = "Expand this text with more detail and examples."; break;
    case "grammar": instruction = "Fix grammar and improve clarity without changing the meaning."; break;
    default: instruction = `Rewrite this text in a ${tone || "professional"} tone.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert editor. Rewrite the provided text according to the instruction. Return only the rewritten text, no explanations." },
        { role: "user", content: `${instruction}\n\nText: ${text}` },
      ],
      max_tokens: 1000,
    });

    const rewritten = completion.choices[0].message.content || "";
    const tokensUsed = completion.usage?.total_tokens || 0;

    await prisma.aIUsageLog.create({
      data: {
        userId: (session.user as any).id,
        agentUsed: "Rewrite & Tone Agent",
        promptSnippet: text.substring(0, 100),
        tokensUsed,
      },
    });

    return NextResponse.json({ rewritten });
  } catch (error) {
    return NextResponse.json({ error: "Rewrite failed. Please try again." }, { status: 500 });
  }
}
