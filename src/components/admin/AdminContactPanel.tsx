import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InstituteSettings } from "@/lib/supabase/types";

type AdminContactPanelProps = {
  settings: InstituteSettings;
  onSave: (payload: InstituteSettings) => Promise<void>;
};

export function AdminContactPanel({ settings, onSave }: AdminContactPanelProps) {
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await onSave(form);
      setMessage("Contact details saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div>
        <h2 className="font-display text-xl font-bold text-navy">Institute contact & location</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Used in the header, footer, contact page and structured data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["name", "Institute name"],
            ["shortName", "Short name"],
            ["brandMark", "Brand mark"],
            ["established", "Established year"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["mapLink", "Google Maps link"],
            ["mapEmbedUrl", "Map embed URL"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Textarea
          id="tagline"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <Button type="button" onClick={() => void submit()} disabled={busy}>
        {busy ? "Saving…" : "Save contact details"}
      </Button>
    </div>
  );
}
