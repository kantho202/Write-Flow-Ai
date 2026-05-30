import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Shield, Globe } from "lucide-react";
import Link from "next/link";

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "AR", bio: "Former ML engineer at Google. Passionate about making AI accessible to every content creator." },
  { name: "Jordan Kim", role: "CTO & Co-founder", avatar: "JK", bio: "Built AI systems at scale. Believes great writing tools should be invisible." },
  { name: "Sam Patel", role: "Head of Product", avatar: "SP", bio: "10 years in SaaS product. Obsessed with user experience and content workflows." },
];

const values = [
  { icon: Zap, title: "Speed Without Compromise", desc: "We believe great content shouldn't take days. Our AI agents work in seconds, not hours." },
  { icon: Users, title: "Built for Teams", desc: "Content is a team sport. WriteFlow is designed for collaboration from the ground up." },
  { icon: Shield, title: "Privacy First", desc: "Your content is yours. We never train our models on your data without explicit consent." },
  { icon: Globe, title: "Accessible to All", desc: "From solo creators to enterprise teams, WriteFlow scales to every use case and budget." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            We're building the future of content creation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            WriteFlow AI was founded in 2024 with a simple mission: give every team the power to create great content at scale, without sacrificing quality or voice.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Join 10,000+ creators</Link>
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">What we stand for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="h-full">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                    <v.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Meet the team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="h-full text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
