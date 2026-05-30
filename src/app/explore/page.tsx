"use client";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, ArrowRight, FileText, Share2, Mail, Megaphone } from "lucide-react";
import Link from "next/link";

const categoryIcons: Record<string, any> = {
  BLOG: FileText,
  SOCIAL_MEDIA: Share2,
  EMAIL: Mail,
  AD_COPY: Megaphone,
};

const categoryColors: Record<string, string> = {
  BLOG: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  SOCIAL_MEDIA: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  EMAIL: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  AD_COPY: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

export default function ExplorePage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("popular");
  const [rating, setRating] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      sort,
      ...(search && { search }),
      ...(category !== "ALL" && { category }),
      ...(rating !== "ALL" && { rating }),
    });
    const res = await fetch(`/api/templates?${params}`);
    const data = await res.json();
    setTemplates(data.templates || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, search, category, sort, rating]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchTemplates(); };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Templates</h1>
          <p className="text-slate-600 dark:text-slate-400">Browse 50+ AI-optimized templates for every content need.</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          <div className="flex flex-wrap gap-3">
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="BLOG">Blog</SelectItem>
                <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="AD_COPY">Ad Copy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rating} onValueChange={(v) => { setRating(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ratings</SelectItem>
                <SelectItem value="4">4★ and above</SelectItem>
                <SelectItem value="3">3★ and above</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No templates found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t) => {
              const Icon = categoryIcons[t.category] || FileText;
              const colorClass = categoryColors[t.category] || categoryColors.BLOG;
              return (
                <Card key={t.id} className="h-full hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`h-12 w-12 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="w-fit mb-3 text-xs">
                      {t.category.replace("_", " ")}
                    </Badge>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-2">{t.description}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{t.avgRating || "New"}</span>
                      </div>
                      <span className="text-xs text-slate-400">{t.usageCount.toLocaleString()} uses</span>
                      <Button size="sm" className="ml-auto text-xs h-7 px-3" asChild>
                        <Link href={`/explore/${t.id}`}>
                          Use <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="w-9"
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
