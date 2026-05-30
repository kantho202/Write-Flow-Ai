"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import {
  BarChart2, Users, FileText, Star, Settings, LogOut,
  PenLine, Moon, Sun, Menu, X, Shield
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Analytics", icon: BarChart2 },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/templates", label: "Manage Templates", icon: FileText },
  { href: "/admin/reviews", label: "Manage Reviews", icon: Star },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Shield className="h-5 w-5" />
              Admin Panel
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              <PenLine className="h-4 w-4" /> User Dashboard
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{session?.user?.name}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Administrator</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Admin Panel</span>
          <div className="w-5" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
