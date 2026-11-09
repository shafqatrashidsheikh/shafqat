import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUrlField } from "@/components/admin/MediaPickerDialog";
import type { DbMediaAsset } from "@/lib/supabase/types";

export type AdminField = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "boolean" | "media_url";
  defaultValue?: string | number | boolean;
  mediaKinds?: DbMediaAsset["media_kind"][];
};

type AdminResourcePanelProps<T extends { id: string }> = {
  title: string;
  rows: T[];
  fields: AdminField[];
  onRefresh: () => Promise<void>;
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: string, payload: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  columns: { key: keyof T | string; label: string }[];
  mediaAssets?: DbMediaAsset[];
};

export function AdminResourcePanel<T extends { id: string }>({
  title,
  rows,
  fields,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  columns,
  mediaAssets = [],
}: AdminResourcePanelProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setForm(Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])));
    setError(null);
    setSuccess(null);
  };

  const loadRow = (row: T) => {
    setEditingId(row.id);
    setForm(
      Object.fromEntries(
        fields.map((f) => {
          const raw = (row as Record<string, unknown>)[f.key] ?? f.defaultValue ?? "";
          const val = Array.isArray(raw) ? raw.join("\n") : raw;
          return [f.key, val];
        }),
      ),
    );
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = Object.fromEntries(
        fields.map((f) => {
          const val = form[f.key];
          if (f.type === "number") return [f.key, Number(val)];
          if (f.type === "boolean") return [f.key, Boolean(val)];
          if (f.type === "textarea" && typeof val === "string" && f.key.includes("areas")) {
            return [f.key, val.split("\n").map((line) => line.trim()).filter(Boolean)];
          }
          return [f.key, val];
        }),
      );
      if (editingId) await onUpdate(editingId, payload);
      else await onCreate(payload);
      resetForm();
      setSuccess("Changes saved successfully.");
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setBusy(true);
    setError(null);
    try {
      await onDelete(id);
      if (editingId === id) resetForm();
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => onRefresh()} disabled={busy}>
          Refresh
        </Button>
      </div>

      <div className="card-premium grid gap-4 p-5 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.type === "textarea" || field.type === "media_url" ? "md:col-span-2" : ""}
          >
            {field.type === "media_url" ? (
              <MediaUrlField
                label={field.label}
                value={String(form[field.key] ?? "")}
                onChange={(url) => setForm((prev) => ({ ...prev, [field.key]: url }))}
                assets={mediaAssets}
                kinds={field.mediaKinds ?? ["pdf", "other"]}
              />
            ) : (
              <>
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                className="mt-1.5"
                value={String(form[field.key] ?? "")}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              />
            ) : field.type === "boolean" ? (
              <div className="mt-2 flex items-center gap-2">
                <Switch
                  id={field.key}
                  checked={Boolean(form[field.key])}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, [field.key]: checked }))}
                />
                <span className="text-sm text-muted-foreground">{form[field.key] ? "Yes" : "No"}</span>
              </div>
            ) : (
              <Input
                id={field.key}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                className="mt-1.5"
                value={String(form[field.key] ?? "")}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: field.type === "number" ? e.target.value : e.target.value,
                  }))
                }
              />
            )}
              </>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button type="button" onClick={submit} disabled={busy}>
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} disabled={busy}>
              Cancel edit
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red md:col-span-2">{error}</p>}
        {success && <p className="text-sm font-medium text-brand md:col-span-2">{success}</p>}
      </div>

      <div className="card-premium overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)}>{c.label}</TableHead>
              ))}
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)} className="max-w-xs truncate">
                    {String((row as Record<string, unknown>)[c.key as string] ?? "")}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => loadRow(row)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => remove(row.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const CMS_TAB =
  "rounded-md border border-border bg-surface-white shadow-none data-[state=active]:border-transparent data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-none";

export function AdminTabsShell({
  children,
  defaultTab = "homepage",
}: {
  children: React.ReactNode;
  defaultTab?: string;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="flex h-auto flex-wrap gap-1.5 bg-transparent p-0">
        <TabsTrigger value="overview" className={CMS_TAB}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="homepage" className={CMS_TAB}>
          Homepage
        </TabsTrigger>
        <TabsTrigger value="site" className={CMS_TAB}>
          Site pages
        </TabsTrigger>
        <TabsTrigger value="about" className={CMS_TAB}>
          About
        </TabsTrigger>
        <TabsTrigger value="principal" className={CMS_TAB}>
          Principal
        </TabsTrigger>
        <TabsTrigger value="contact" className={CMS_TAB}>
          Contact
        </TabsTrigger>
        <TabsTrigger value="campus" className={CMS_TAB}>
          Campus
        </TabsTrigger>
        <TabsTrigger value="navigation" className={CMS_TAB}>
          Navigation
        </TabsTrigger>
        <TabsTrigger value="media" className={CMS_TAB}>
          Media
        </TabsTrigger>
        <TabsTrigger value="notices" className={CMS_TAB}>
          Notices
        </TabsTrigger>
        <TabsTrigger value="events" className={CMS_TAB}>
          Events
        </TabsTrigger>
        <TabsTrigger value="departments" className={CMS_TAB}>
          Departments
        </TabsTrigger>
        <TabsTrigger value="programs" className={CMS_TAB}>
          Programs
        </TabsTrigger>
        <TabsTrigger value="admissions" className={CMS_TAB}>
          Admissions
        </TabsTrigger>
        <TabsTrigger value="users" className={CMS_TAB}>
          Users
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent };
