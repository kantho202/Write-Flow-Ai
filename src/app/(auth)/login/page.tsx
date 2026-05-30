"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Eye, EyeOff, Globe } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  const fillDemo = (type: "user" | "admin") => {
    const creds = type === "user"
      ? { email: "user@writeflow.com", password: "123456" }
      : { email: "admin@writeflow.com", password: "123456" };
    setValue("email", creds.email);
    setValue("password", creds.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-6">
            <PenLine className="h-6 w-6" />
            WriteFlow AI
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          {/* Demo buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => fillDemo("user")}
              className="text-xs py-2 px-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors font-medium"
            >
              Demo User Login
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="text-xs py-2 px-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-medium"
            >
              Demo Admin Login
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white dark:bg-slate-800 px-2">or sign in with email</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white dark:bg-slate-800 px-2">or continue with</div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Globe className="h-4 w-4" /> Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
