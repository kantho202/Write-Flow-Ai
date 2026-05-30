"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Zap, DollarSign } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    { label: "Total Users", value: data?.overview?.totalUsers?.toLocaleString(), icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { label: "Total Documents", value: data?.overview?.totalDocuments?.toLocaleString(), icon: FileText, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "AI Calls Today", value: data?.overview?.aiCallsToday?.toLocaleString(), icon: Zap, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Monthly Revenue", value: `$${data?.overview?.monthlyRevenue?.toLocaleString()}`, icon: DollarSign, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform performance at a glance.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Daily AI Usage (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.dailyAI || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="AI Calls" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">User Signups (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.signupTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} name="Signups" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Content Type Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data?.contentTypes || []} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {(data?.contentTypes || []).map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
