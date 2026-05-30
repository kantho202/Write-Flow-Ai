"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) {
    return <div className="max-w-2xl mx-auto space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global platform settings.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName || ""}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={settings.logo || ""}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              placeholder="https://..."
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Maintenance Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show a maintenance page to all visitors.</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">AI Agents</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enable or disable all AI features platform-wide.</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, aiEnabled: !settings.aiEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.aiEnabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.aiEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" /> Settings saved successfully!
            </div>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
