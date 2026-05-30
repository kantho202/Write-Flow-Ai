"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, PenLine, ChevronDown, LogOut, User, Settings } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/documents", label: "My Documents" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const links = session ? authLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <PenLine className="h-6 w-6" />
            WriteFlow AI
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => setProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-slate-200 dark:border-slate-700" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
