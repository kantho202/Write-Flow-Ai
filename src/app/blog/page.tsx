import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const posts = [
  { slug: "ai-content-strategy-2024", title: "How to Build an AI-Powered Content Strategy in 2024", excerpt: "Learn how leading marketing teams are using AI agents to 10x their content output without sacrificing quality or brand voice.", category: "Strategy", readTime: "8 min", date: "May 15, 2024" },
  { slug: "tone-rewriting-guide", title: "The Complete Guide to AI Tone Rewriting", excerpt: "Discover how to use tone rewriting to adapt your content for different audiences, platforms, and contexts — all in seconds.", category: "Tutorial", readTime: "6 min", date: "May 10, 2024" },
  { slug: "seo-blog-posts-ai", title: "Writing SEO Blog Posts with AI: What Actually Works", excerpt: "We analyzed 500 AI-generated blog posts to find what separates the ones that rank from the ones that don't.", category: "SEO", readTime: "10 min", date: "May 5, 2024" },
  { slug: "team-content-workflows", title: "5 Content Workflows That Scale with Your Team", excerpt: "From solo creator to 10-person content team — here are the workflows that keep everyone aligned and productive.", category: "Productivity", readTime: "7 min", date: "Apr 28, 2024" },
  { slug: "email-copywriting-ai", title: "Email Copywriting with AI: A Practical Playbook", excerpt: "Cold emails, newsletters, drip campaigns — learn how to use AI to write emails that actually get opened and clicked.", category: "Email", readTime: "9 min", date: "Apr 20, 2024" },
  { slug: "social-media-captions", title: "Generating Social Media Captions That Drive Engagement", excerpt: "Platform-specific tips for using AI to write Instagram, LinkedIn, and Twitter captions that grow your audience.", category: "Social Media", readTime: "5 min", date: "Apr 15, 2024" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">WriteFlow Blog</h1>
          <p className="text-slate-600 dark:text-slate-400">Insights on AI content creation, writing strategies, and product updates.</p>
        </div>

        {/* Featured post */}
        <Card className="mb-8 overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
            <Badge className="mb-3">{posts[0].category}</Badge>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{posts[0].title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{posts[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{posts[0].readTime} read</span>
                <span>·</span>
                <span>{posts[0].date}</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/blog/${posts[0].slug}`}>Read more <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <Card key={post.slug} className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <Badge variant="secondary" className="w-fit mb-3 text-xs">{post.category}</Badge>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                  <Button variant="ghost" size="sm" asChild className="text-xs h-7">
                    <Link href={`/blog/${post.slug}`}>Read <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
