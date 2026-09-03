import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { DbPageSection } from "@/lib/supabase/types";

const SECTION_LABELS: Record<string, string> = {
  hero: "Homepage hero",
  home_about: "Homepage about block",
  admissions_cta: "Homepage admissions CTA",
  student_life: "Homepage student life",
  placement_blurb: "Homepage placement blurb",
  institute: "Institute name & address",
};

type AdminPageSectionsPanelProps = {
  sections: DbPageSection[];
  onRefresh: () => Promise<void>;
  onSave: (sectionKey: string, payload: Record<string, unknown>) => Promise<void>;
};

export function AdminPageSectionsPanel({ sections, onRefresh, onSave }: AdminPageSectionsPanelProps) {
  const [activeKey, setActiveKey] = useState(sections[0]?.section_key ?? "hero");
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const active = sections.find((s) => s.section_key === activeKey) ?? sections[0];

  useEffect(() => {
    if (!active) return;
    setForm({
      eyebrow: active.eyebrow ?? "",
      title: active.title,
      body: active.body,
      cta_label: active.cta_label ?? "",
      cta_href: active.cta_href ?? "",
      is_active: active.is_active,
    });
    setError(null);
    setSuccess(null);
  }, [active]);

  const selectSection = (row: DbPageSection) => {
    setActiveKey(row.section_key);
  };

  const submit = async () => {
    if (!activeKey) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(activeKey, {
        eyebrow: String(form.eyebrow ?? "") || null,
        title: String(form.title ?? ""),
        body: String(form.body ?? ""),
        cta_label: String(form.cta_label ?? "") || null,
        cta_href: String(form.cta_href ?? "") || null,
        is_active: Boolean(form.is_active),
      });
      setSuccess("Changes saved successfully.");
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-navy">Page sections</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => onRefresh()} disabled={busy}>
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.section_key}
            type="button"
            size="sm"
            variant={section.section_key === activeKey ? "default" : "outline"}
            onClick={() => selectSection(section)}
          >
            {SECTION_LABELS[section.section_key] ?? section.section_key}
          </Button>
        ))}
      </div>

      {active && (
        <div className="card-premium grid gap-4 p-5 md:grid-cols-2">
          <div>
            <Label htmlFor="eyebrow">Eyebrow</Label>
            <Input
              id="eyebrow"
              className="mt-1.5"
              value={String(form.eyebrow ?? "")}
              onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              className="mt-1.5"
              value={String(form.title ?? "")}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              className="mt-1.5 min-h-28"
              value={String(form.body ?? "")}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cta_label">CTA label</Label>
            <Input
              id="cta_label"
              className="mt-1.5"
              value={String(form.cta_label ?? "")}
              onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cta_href">CTA link</Label>
            <Input
              id="cta_href"
              className="mt-1.5"
              value={String(form.cta_href ?? "")}
              onChange={(e) => setForm((f) => ({ ...f, cta_href: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              checked={Boolean(form.is_active)}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
            />
            <Label>Active on website</Label>
          </div>
          {error && <p className="text-sm text-red md:col-span-2">{error}</p>}
          {success && <p className="text-sm font-medium text-brand md:col-span-2">{success}</p>}
          <div className="md:col-span-2">
            <Button type="button" onClick={submit} disabled={busy}>
              Save section
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
