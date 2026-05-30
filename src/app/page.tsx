"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Zap, Users, Edit3, Star, ChevronDown, ChevronUp, ArrowRight,
  FileText, Share2, Mail, Megaphone, CheckCircle, Sparkles,
  TrendingUp, Shield, Clock, Globe
} from "lucide-react";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// Typing effect
function TypingEffect({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting && charIndex < current.length) {
        setCharIndex((c) => c + 1);
      } else if (!deleting && charIndex === current.length) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && charIndex > 0) {
        setCharIndex((c) => c - 1);
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words]);

  return (
    <span className="text-indigo-600 dark:text-indigo-400">
      {words[wordIndex].substring(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const features = [
  { icon: Zap, title: "AI Drafting", desc: "Generate blog posts, social captions, and emails in seconds with GPT-4o. Just enter your topic and let the AI do the heavy lifting." },
  { icon: Edit3, title: "Tone Rewriting", desc: "Select any text and instantly rewrite it in formal, casual, persuasive, or friendly tones. Fix grammar and improve clarity automatically." },
  { icon: Users, title: "Team Collaboration", desc: "Invite your team, assign roles, and collaborate on content in real time. Shared templates and a unified workspace keep everyone aligned." },
];

const steps = [
  { step: "01", title: "Pick a Template", desc: "Browse 50+ AI-optimized templates for blogs, social media, emails, and ads." },
  { step: "02", title: "Enter Your Topic", desc: "Tell the AI your topic, tone, and target audience in plain language." },
  { step: "03", title: "AI Generates", desc: "Our agents draft structured, ready-to-edit content in under 10 seconds." },
  { step: "04", title: "Edit & Publish", desc: "Refine in the rich editor, then publish or export with one click." },
];

const templates = [
  { title: "SEO Blog Post", category: "Blog", rating: 4.9, uses: "4.8k", icon: FileText, color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" },
  { title: "Instagram Caption", category: "Social Media", rating: 4.8, uses: "7.2k", icon: Share2, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { title: "Cold Email Outreach", category: "Email", rating: 4.7, uses: "3.1k", icon: Mail, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { title: "Facebook Ad Copy", category: "Ad Copy", rating: 4.6, uses: "2.9k", icon: Megaphone, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
];

const pricingPlans = [
  {
    name: "Free", price: "$0", period: "/month", color: "border-slate-200 dark:border-slate-700",
    features: ["5 AI generations/month", "3 templates", "Basic editor", "Email support"],
    missing: ["Team collaboration", "Priority AI", "Analytics"],
    cta: "Get Started Free", variant: "outline" as const,
  },
  {
    name: "Pro", price: "$19", period: "/month", color: "border-indigo-500", popular: true,
    features: ["Unlimited AI generations", "All 50+ templates", "Advanced editor", "Tone rewriting", "AI chat assistant", "Priority support"],
    missing: ["Team collaboration"],
    cta: "Start Pro Trial", variant: "default" as const,
  },
  {
    name: "Team", price: "$49", period: "/month", color: "border-amber-500",
    features: ["Everything in Pro", "Up to 10 team members", "Shared workspace", "Admin dashboard", "Analytics & reports", "Dedicated support"],
    missing: [],
    cta: "Start Team Trial", variant: "amber" as const,
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "Content Manager @ TechCorp", avatar: "SC", rating: 5, review: "WriteFlow AI cut our content production time by 70%. The tone rewriting feature alone is worth the subscription. Our blog traffic doubled in 3 months." },
  { name: "Marcus Johnson", role: "Freelance Copywriter", avatar: "MJ", rating: 5, review: "I was skeptical about AI writing tools, but WriteFlow is different. The output actually sounds like me, not a robot. My clients can't tell the difference." },
  { name: "Priya Patel", role: "Marketing Director @ StartupXYZ", avatar: "PP", rating: 4, review: "The team collaboration features are excellent. We can now manage all our content — blog, social, email — from one place. Game changer for our small team." },
];

const faqs = [
  { q: "Is the AI content original and plagiarism-free?", a: "Yes. WriteFlow AI generates unique content for every request using GPT-4o. Each output is original and not copied from existing sources. We recommend running a final check with your preferred plagiarism tool before publishing." },
  { q: "Can I use WriteFlow AI for my entire team?", a: "Absolutely. The Team plan supports up to 10 members with a shared workspace, role management, and collaborative editing. Enterprise plans with unlimited seats are available on request." },
  { q: "What content types does WriteFlow support?", a: "Blog posts, social media captions (Instagram, LinkedIn, Twitter/X), email campaigns, ad copy, product descriptions, newsletters, and more. New templates are added monthly." },
  { q: "How does the AI chat assistant work?", a: "The chat assistant lives inside the editor and understands your current document. Ask it to suggest ideas, expand sections, fix grammar, or answer writing questions — all in context." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, cancel anytime with no penalties. Your plan stays active until the end of the billing period, and you keep access to all your documents." },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const users = useCounter(10000);
  const words = useCounter(500000);
  const templates_count = useCounter(50);
  const satisfaction = useCounter(98);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubscribing(false);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* 1. Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge className="mb-6 text-sm px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Powered by GPT-4o
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Write{" "}
            <TypingEffect words={["Blog Posts", "Social Captions", "Email Copy", "Ad Content", "Newsletters"]} />
            <br />
            <span className="text-slate-700 dark:text-slate-300">10x Faster with AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            WriteFlow AI is the agentic content workspace where teams plan, generate, review, and publish content — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link href="/register">
                Start Writing Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/explore">Browse Templates</Link>
            </Button>
          </div>

          {/* Floating cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Blog post generated", time: "8 seconds", color: "text-green-600" },
              { label: "Tone rewritten", time: "2 seconds", color: "text-indigo-600" },
              { label: "Email drafted", time: "5 seconds", color: "text-amber-600" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex items-center gap-3">
                <CheckCircle className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                  <p className={`text-xs font-semibold ${item.color}`}>in {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Features */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to create great content</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Three powerful AI agents working together to take your content from idea to published.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">How WriteFlow Works</h2>
            <p className="text-slate-600 dark:text-slate-400">From blank page to published content in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-full">
                  <span className="text-4xl font-bold text-indigo-100 dark:text-indigo-900">{s.step}</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Templates */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Popular Templates</h2>
              <p className="text-slate-600 dark:text-slate-400">Start with a proven template and customize it for your needs.</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/explore">View All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t) => (
              <Card key={t.title} className="h-full hover:shadow-md transition-all hover:-translate-y-0.5">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`h-12 w-12 rounded-xl ${t.color} flex items-center justify-center mb-4`}>
                    <t.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="w-fit mb-3 text-xs">{t.category}</Badge>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t.title}</h3>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{t.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">{t.uses} uses</span>
                    <Button size="sm" className="ml-auto text-xs h-7 px-3" asChild>
                      <Link href={`/explore`}>Use</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`relative bg-white dark:bg-slate-800 rounded-xl border-2 ${plan.color} p-6 ${plan.popular ? "shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-400 line-through">
                      <CheckCircle className="h-4 w-4 text-slate-300 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} className="w-full" asChild>
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Statistics */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div ref={users.ref}>
              <div className="text-4xl sm:text-5xl font-bold mb-2">{users.count.toLocaleString()}+</div>
              <div className="text-indigo-200">Active Users</div>
            </div>
            <div ref={words.ref}>
              <div className="text-4xl sm:text-5xl font-bold mb-2">{(words.count / 1000).toFixed(0)}K+</div>
              <div className="text-indigo-200">Words Generated</div>
            </div>
            <div ref={templates_count.ref}>
              <div className="text-4xl sm:text-5xl font-bold mb-2">{templates_count.count}+</div>
              <div className="text-indigo-200">AI Templates</div>
            </div>
            <div ref={satisfaction.ref}>
              <div className="text-4xl sm:text-5xl font-bold mb-2">{satisfaction.count}%</div>
              <div className="text-indigo-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-slate-600 dark:text-slate-400">Real results from real content creators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 mb-4">"{t.review}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Stay in the loop</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Get weekly tips on AI content creation, new templates, and product updates.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="h-5 w-5" />
              You're subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={subscribing} className="sm:w-auto">
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
          <p className="text-xs text-slate-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
