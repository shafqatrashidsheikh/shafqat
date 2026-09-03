import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { DbPrincipalProfile } from "@/lib/supabase/types";

type AdminPrincipalPanelProps = {
  principal: DbPrincipalProfile | null;
  onSave: (payload: {
    name: string;
    role: string;
    institute: string;
    portrait_asset_key: string | null;
    portrait_alt: string;
    preview: string;
    message_paragraphs: string;
    is_published: boolean;
  }) => Promise<void>;
};

export function AdminPrincipalPanel({ principal, onSave }: AdminPrincipalPanelProps) {
  const [form, setForm] = useState({
    name: principal?.name ?? "",
    role: principal?.role ?? "Principal",
    institute: principal?.institute ?? "",
    portrait_asset_key: principal?.portrait_asset_key ?? "principal-imtiyaz-shaw",
    portrait_alt: principal?.portrait_alt ?? "",
    preview: principal?.preview ?? "",
    message_paragraphs: (principal?.message_paragraphs ?? []).join("\n\n"),
    is_published: principal?.is_published ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await onSave({
        ...form,
        portrait_asset_key: form.portrait_asset_key || null,
        message_paragraphs: form.message_paragraphs,
      });
      setMessage("Principal profile saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div>
        <h2 className="font-display text-xl font-bold text-navy">Principal&apos;s message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Homepage principal section, about page and principal message page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="principal-name">Name</Label>
          <Input
            id="principal-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="principal-role">Designation</Label>
          <Input
            id="principal-role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="principal-institute">Institute line</Label>
        <Input
          id="principal-institute"
          value={form.institute}
          onChange={(e) => setForm({ ...form, institute: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="portrait-key">Portrait media asset key</Label>
          <Input
            id="portrait-key"
            value={form.portrait_asset_key}
            onChange={(e) => setForm({ ...form, portrait_asset_key: e.target.value })}
            placeholder="principal-imtiyaz-shaw"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portrait-alt">Portrait alt text</Label>
          <Input
            id="portrait-alt"
            value={form.portrait_alt}
            onChange={(e) => setForm({ ...form, portrait_alt: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preview">Homepage preview quote</Label>
        <Textarea
          id="preview"
          value={form.preview}
          onChange={(e) => setForm({ ...form, preview: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Full message (paragraphs separated by a blank line)</Label>
        <Textarea
          id="message"
          className="min-h-40"
          value={form.message_paragraphs}
          onChange={(e) => setForm({ ...form, message_paragraphs: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.is_published}
          onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
        />
        <Label>Published on public website</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <Button type="button" onClick={() => void submit()} disabled={busy}>
        {busy ? "Saving…" : "Save principal profile"}
      </Button>
    </div>
  );
}
