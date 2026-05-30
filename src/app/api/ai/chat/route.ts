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

  const { messages, documentContext } = await req.json();
  if (!messages?.length) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const systemMessage = `You are WriteFlow AI's content assistant. You help users improve their writing, suggest ideas, and answer writing-related questions.
${documentContext ? `\nCurrent document context:\n${documentContext.substring(0, 500)}` : ""}
Keep responses concise and actionable. Focus on writing quality and content strategy.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        ...messages,
      ],
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content || "";
    const tokensUsed = completion.usage?.total_tokens || 0;

    await prisma.aIUsageLog.create({
      data: {
        userId: (session.user as any).id,
        agentUsed: "AI Content Chat Assistant",
        promptSnippet: messages[messages.length - 1]?.content?.substring(0, 100) || "",
        tokensUsed,
      },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Chat failed. Please try again." }, { status: 500 });
  }
}
