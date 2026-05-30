"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, CheckCircle, ArrowLeft } from "lucide-react";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-6">
            <PenLine className="h-6 w-6" />
            WriteFlow AI
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset your password</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We've sent a password reset link to your email. It expires in 1 hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
