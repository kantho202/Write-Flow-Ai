"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, FileText, PenLine } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch("/api/user/profile").then((r) => r.json()).then((d) => {
      setProfile(d);
      reset({ name: d.name || "", bio: d.bio || "" });
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setProfile((p: any) => ({ ...p, ...updated }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account information.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.stats?.docsThisMonth || 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Docs this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <PenLine className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(profile.stats?.totalWords || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total words</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <Badge variant="success" className="text-xs">{profile.plan}</Badge>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Plan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {profile.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{profile.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">{profile.role}</Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" className="mt-1" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled className="mt-1 opacity-60" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us a bit about yourself..." className="mt-1" rows={3} {...register("bio")} />
              {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" /> Profile updated successfully!
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
