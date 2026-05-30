"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, PenLine, ArrowRight, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then(setProfile);
    fetch("/api/documents?page=1").then((r) => r.json()).then((d) => setRecentDocs(d.documents?.slice(0, 5) || []));
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your content.</p>
      </div>

      {isAdmin && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-400">You have admin access</p>
            <p className="text-sm text-amber-600 dark:text-amber-500">Manage users, templates, and site settings.</p>
          </div>
          <Button variant="amber" size="sm" asChild>
            <Link href="/admin">Admin Panel <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.stats?.docsThisMonth || 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Docs this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <PenLine className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{(profile?.stats?.totalWords || 0).toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total words generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{profile?.plan?.toLowerCase() || "Free"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current plan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5">
            <Link href="/editor" className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <PenLine className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">New Document</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Start writing with AI assistance</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 ml-auto" />
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5">
            <Link href="/explore" className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Browse Templates</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">50+ AI-optimized templates</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 ml-auto" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent documents */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Documents</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/documents">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {recentDocs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">You have no documents yet.</p>
              <Button size="sm" className="mt-3" asChild>
                <Link href="/editor">Start writing →</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <Link key={doc.id} href={`/editor?doc=${doc.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.wordCount} words</p>
                  </div>
                  <Badge variant={doc.status === "PUBLISHED" ? "success" : doc.status === "ARCHIVED" ? "secondary" : "warning"} className="text-xs flex-shrink-0">
                    {doc.status.toLowerCase()}
                  </Badge>
                  <Clock className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
