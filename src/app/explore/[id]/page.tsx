"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, FileText, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function TemplateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/templates/${id}`)
      .then((r) => r.json())
      .then((d) => { setTemplate(d); setLoading(false); });
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setSubmitting(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: id, rating: reviewRating, content: reviewContent }),
    });
    setSubmitting(false);
    setReviewSuccess(true);
    setReviewContent("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!template || template.error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-slate-500">Template not found.</p>
          <Button className="mt-4" onClick={() => router.push("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{template.category?.replace("_", " ")}</Badge>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{template.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">{template.description}</p>
          <div className="flex flex-wrap items-center gap-4">
            {template.avgRating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(template.avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                ))}
                <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">{parseFloat(template.avgRating).toFixed(1)} ({template._count?.reviews} reviews)</span>
              </div>
            )}
            <span className="text-sm text-slate-500">{template.usageCount?.toLocaleString()} uses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Overview</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  This template is designed to help you create {template.title.toLowerCase()} quickly and effectively using AI. It's best suited for content creators, marketers, and businesses looking to scale their content production.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Content Creators", "Marketers", "Businesses", "Freelancers"].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sample Output */}
            {template.sampleOutput && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Sample Output</h2>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                    {template.sampleOutput}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Reviews</h2>
                {template.reviews?.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {template.reviews?.map((r: any) => (
                      <div key={r.id} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {r.user?.name?.[0] || "U"}
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{r.user?.name || "User"}</span>
                          <div className="flex items-center gap-0.5 ml-auto">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit review */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Leave a Review</h3>
                  {reviewSuccess ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" /> Review submitted for approval!
                    </div>
                  ) : (
                    <form onSubmit={submitReview} className="space-y-3">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button key={r} type="button" onClick={() => setReviewRating(r)}>
                              <Star className={`h-6 w-6 ${r <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"} hover:text-amber-400 transition-colors`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="review">Your Review</Label>
                        <Textarea
                          id="review"
                          placeholder="Share your experience with this template..."
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          className="mt-1"
                          rows={3}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={submitting} size="sm">
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Button className="w-full mb-4" size="lg" asChild>
                  <a href={`/editor?template=${template.id}`}>
                    Use This Template <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Category</span>
                    <Badge variant="secondary">{template.category?.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Est. Word Count</span>
                    <span className="font-medium text-slate-900 dark:text-white">{template.wordCount || "Varies"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Tone</span>
                    <span className="font-medium text-slate-900 dark:text-white">{template.tone || "Flexible"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">AI Model</span>
                    <span className="font-medium text-slate-900 dark:text-white">{template.aiModel || "GPT-4o"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
