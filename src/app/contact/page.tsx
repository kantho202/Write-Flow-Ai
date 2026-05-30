"use client";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquare, Clock, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Have a question, feedback, or want to explore enterprise options? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email Us", desc: "hello@writeflow.ai", sub: "We reply within 24 hours" },
              { icon: MessageSquare, title: "Live Chat", desc: "Available in the app", sub: "Mon–Fri, 9am–6pm EST" },
              { icon: Clock, title: "Response Time", desc: "Under 24 hours", sub: "For all support requests" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Message sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" className="mt-1" {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...register("email")} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" className="mt-1" {...register("subject")} />
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Tell us more..." className="mt-1" rows={5} {...register("message")} />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
