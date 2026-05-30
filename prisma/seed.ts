import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const DB_URL = "file:b:/Programing-hero-course/WriteFlowAi/writeflow-ai/prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: DB_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const userPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "user@writeflow.com" },
    update: {},
    create: {
      email: "user@writeflow.com",
      name: "Demo User",
      password: userPassword,
      role: "USER",
      plan: "PRO",
      bio: "Content creator and marketing enthusiast.",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@writeflow.com" },
    update: {},
    create: {
      email: "admin@writeflow.com",
      name: "Admin User",
      password: userPassword,
      role: "ADMIN",
      plan: "TEAM",
      bio: "Platform administrator.",
    },
  });

  const templates = [
    {
      id: "seo-blog-post",
      title: "SEO Blog Post",
      description: "Generate a fully optimized blog post with headings, meta description, and keyword-rich content.",
      category: "BLOG",
      prompt: "Write a comprehensive SEO-optimized blog post about {topic} targeting {audience}.",
      sampleOutput: "# 10 Ways to Boost Your Productivity in 2024\n\nIn today's fast-paced world...",
      tone: "Professional",
      wordCount: 1200,
      aiModel: "gpt-4o",
      usageCount: 4823,
    },
    {
      id: "instagram-caption",
      title: "Instagram Caption",
      description: "Craft engaging Instagram captions with hashtags that drive engagement and grow your audience.",
      category: "SOCIAL_MEDIA",
      prompt: "Write 3 Instagram caption variations for {topic} with relevant hashtags. Tone: {tone}.",
      sampleOutput: "✨ Transform your mornings with these 5 simple habits...",
      tone: "Casual",
      wordCount: 150,
      aiModel: "gpt-4o",
      usageCount: 7241,
    },
    {
      id: "cold-email-outreach",
      title: "Cold Email Outreach",
      description: "Write personalized cold emails that get responses. Perfect for sales and business development.",
      category: "EMAIL",
      prompt: "Write a cold outreach email to {recipient} about {offer}. Keep it under 150 words with a clear CTA.",
      sampleOutput: "Hi [Name],\n\nI noticed your company recently...",
      tone: "Persuasive",
      wordCount: 150,
      aiModel: "gpt-4o",
      usageCount: 3102,
    },
    {
      id: "facebook-ad-copy",
      title: "Facebook Ad Copy",
      description: "High-converting Facebook ad copy with headline, body, and call-to-action for any product.",
      category: "AD_COPY",
      prompt: "Write Facebook ad copy for {product}. Include headline, primary text, and CTA. Target: {audience}.",
      sampleOutput: "Headline: Stop Wasting Time on Content\nBody: WriteFlow AI generates...",
      tone: "Persuasive",
      wordCount: 100,
      aiModel: "gpt-4o",
      usageCount: 2890,
    },
    {
      id: "linkedin-post",
      title: "LinkedIn Post",
      description: "Professional LinkedIn posts that establish thought leadership and drive meaningful engagement.",
      category: "SOCIAL_MEDIA",
      prompt: "Write a LinkedIn post about {topic} that demonstrates expertise. Include a hook, insight, and engagement question.",
      sampleOutput: "I made a $50K mistake last year. Here's what I learned...",
      tone: "Professional",
      wordCount: 300,
      aiModel: "gpt-4o",
      usageCount: 5612,
    },
    {
      id: "newsletter-email",
      title: "Newsletter Email",
      description: "Engaging weekly newsletter emails that keep your subscribers coming back for more.",
      category: "EMAIL",
      prompt: "Write a newsletter email for {brand} about {topic}. Include subject line, preview text, and 3 content sections.",
      sampleOutput: "Subject: This week in AI: 5 tools you need to know\n\nHi there...",
      tone: "Friendly",
      wordCount: 500,
      aiModel: "gpt-4o",
      usageCount: 1987,
    },
    {
      id: "product-description",
      title: "Product Description",
      description: "Compelling product descriptions that highlight benefits and drive conversions for e-commerce.",
      category: "AD_COPY",
      prompt: "Write a product description for {product}. Highlight key features, benefits, and include a persuasive CTA.",
      sampleOutput: "Introducing the SmartDesk Pro — the standing desk that...",
      tone: "Persuasive",
      wordCount: 200,
      aiModel: "gpt-4o",
      usageCount: 3445,
    },
    {
      id: "twitter-x-thread",
      title: "Twitter/X Thread",
      description: "Viral Twitter threads that educate, entertain, and grow your following organically.",
      category: "SOCIAL_MEDIA",
      prompt: "Write a 10-tweet thread about {topic}. Start with a hook tweet, include value in each tweet, end with a CTA.",
      sampleOutput: "1/ I studied 100 viral threads. Here's the formula they all use:\n\n2/ Hook...",
      tone: "Casual",
      wordCount: 400,
      aiModel: "gpt-4o",
      usageCount: 6103,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {},
      create: template,
    });
  }

  const documents = [
    {
      id: "doc-1",
      title: "10 Productivity Hacks for Remote Workers",
      content: "Remote work has transformed how we approach productivity...",
      status: "PUBLISHED",
      userId: user.id,
      wordCount: 1150,
    },
    {
      id: "doc-2",
      title: "Instagram Campaign - Summer Collection",
      content: "☀️ Summer is here and so is our hottest collection yet...",
      status: "DRAFT",
      userId: user.id,
      wordCount: 120,
    },
    {
      id: "doc-3",
      title: "Q4 Newsletter Draft",
      content: "Dear subscribers, as we close out an incredible year...",
      status: "DRAFT",
      userId: user.id,
      wordCount: 480,
    },
  ];

  for (const doc of documents) {
    await prisma.document.upsert({ where: { id: doc.id }, update: {}, create: doc });
  }

  const logs = [
    {
      id: "log-1",
      userId: user.id,
      agentUsed: "Content Draft Agent",
      promptSnippet: "Write a blog post about remote work productivity...",
      tokensUsed: 1240,
    },
    {
      id: "log-2",
      userId: user.id,
      agentUsed: "Rewrite & Tone Agent",
      promptSnippet: "Rewrite this paragraph in a casual tone...",
      tokensUsed: 380,
    },
    {
      id: "log-3",
      userId: user.id,
      agentUsed: "Content Draft Agent",
      promptSnippet: "Generate Instagram captions for summer collection...",
      tokensUsed: 520,
    },
  ];

  for (const log of logs) {
    await prisma.aIUsageLog.upsert({ where: { id: log.id }, update: {}, create: log });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "WriteFlow AI",
      maintenanceMode: false,
      aiEnabled: true,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
